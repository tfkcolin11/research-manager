import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const bigQuestions = await prisma.bigQuestion.findMany({
      where: { projectId: id },
      include: {
        researchQuestions: {
          include: {
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
          }
        }
      },
      orderBy: { text: 'asc' }
    });

    return NextResponse.json(bigQuestions);
  } catch (error) {
    console.error('Error fetching big questions:', error);
    return NextResponse.json({ error: 'Failed to fetch big questions' }, { status: 500 });
  }
}

export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;
    const { text } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    if (!text) {
      return NextResponse.json({ error: 'Big question text is required' }, { status: 400 });
    }

    const bigQuestion = await prisma.bigQuestion.create({
      data: {
        text,
        projectId: id,
      },
      include: {
        researchQuestions: true
      }
    });

    return NextResponse.json(bigQuestion, { status: 201 });
  } catch (error) {
    console.error('Error creating big question:', error);
    return NextResponse.json({ error: 'Failed to create big question' }, { status: 500 });
  }
}
