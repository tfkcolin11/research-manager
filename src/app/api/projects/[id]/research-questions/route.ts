import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Get all research questions for the project, including orphaned ones (no big question parent)
    const researchQuestions = await prisma.researchQuestion.findMany({
      where: { projectId: id },
      include: {
        bigQuestion: true,
        parent: true,
        children: {
          include: {
            children: true, // Support nested questions up to 3 levels
            answers: {
              include: {
                paper: true
              }
            }
          }
        },
        answers: {
          include: {
            paper: true
          }
        }
      },
      orderBy: { text: 'asc' }
    });

    return NextResponse.json(researchQuestions);
  } catch (error) {
    console.error('Error fetching research questions:', error);
    return NextResponse.json({ error: 'Failed to fetch research questions' }, { status: 500 });
  }
}

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;
    const { text, bigQuestionId, parentId } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    if (!text) {
      return NextResponse.json({ error: 'Research question text is required' }, { status: 400 });
    }

    // Validate that bigQuestionId belongs to the same project if provided
    if (bigQuestionId) {
      const bigQuestion = await prisma.bigQuestion.findUnique({
        where: { id: bigQuestionId, projectId: id }
      });
      if (!bigQuestion) {
        return NextResponse.json({ error: 'Invalid big question ID' }, { status: 400 });
      }
    }

    // Validate that parentId belongs to the same project if provided
    if (parentId) {
      const parentQuestion = await prisma.researchQuestion.findUnique({
        where: { id: parentId, projectId: id }
      });
      if (!parentQuestion) {
        return NextResponse.json({ error: 'Invalid parent question ID' }, { status: 400 });
      }
    }

    const researchQuestion = await prisma.researchQuestion.create({
      data: {
        text,
        projectId: id,
        bigQuestionId: bigQuestionId || null,
        parentId: parentId || null,
      },
      include: {
        bigQuestion: true,
        parent: true,
        children: true,
        answers: {
          include: {
            paper: true
          }
        }
      }
    });

    return NextResponse.json(researchQuestion, { status: 201 });
  } catch (error) {
    console.error('Error creating research question:', error);
    return NextResponse.json({ error: 'Failed to create research question' }, { status: 500 });
  }
}
