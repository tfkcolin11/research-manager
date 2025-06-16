import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string, questionId: string } }) {
  try {
    const { id: projectId, questionId } = params;

    if (!projectId || !questionId) {
      return NextResponse.json({ error: 'Project ID and Question ID are required' }, { status: 400 });
    }

    const researchQuestion = await prisma.researchQuestion.findUnique({
      where: {
        id: questionId,
        projectId: projectId,
      },
      include: {
        bigQuestion: true,
        parent: true,
        children: {
          include: {
            children: true,
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
    });

    if (!researchQuestion) {
      return NextResponse.json({ error: 'Research question not found' }, { status: 404 });
    }

    return NextResponse.json(researchQuestion);
  } catch (error) {
    console.error('Error fetching research question:', error);
    return NextResponse.json({ error: 'Failed to fetch research question' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string, questionId: string } }) {
  try {
    const { id: projectId, questionId } = params;
    const { text, bigQuestionId, parentId } = await request.json();

    if (!projectId || !questionId) {
      return NextResponse.json({ error: 'Project ID and Question ID are required' }, { status: 400 });
    }
    if (!text) {
      return NextResponse.json({ error: 'Research question text is required' }, { status: 400 });
    }

    // Validate that bigQuestionId belongs to the same project if provided
    if (bigQuestionId) {
      const bigQuestion = await prisma.bigQuestion.findUnique({
        where: { id: bigQuestionId, projectId: projectId }
      });
      if (!bigQuestion) {
        return NextResponse.json({ error: 'Invalid big question ID' }, { status: 400 });
      }
    }

    // Validate that parentId belongs to the same project if provided and is not the same as questionId
    if (parentId) {
      if (parentId === questionId) {
        return NextResponse.json({ error: 'A question cannot be its own parent' }, { status: 400 });
      }
      const parentQuestion = await prisma.researchQuestion.findUnique({
        where: { id: parentId, projectId: projectId }
      });
      if (!parentQuestion) {
        return NextResponse.json({ error: 'Invalid parent question ID' }, { status: 400 });
      }
    }

    const updatedResearchQuestion = await prisma.researchQuestion.update({
      where: {
        id: questionId,
        projectId: projectId,
      },
      data: {
        text,
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

    return NextResponse.json(updatedResearchQuestion, { status: 200 });
  } catch (error) {
    console.error('Error updating research question:', error);
    return NextResponse.json({ error: 'Failed to update research question' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string, questionId: string } }) {
  try {
    const { id: projectId, questionId } = params;

    if (!projectId || !questionId) {
      return NextResponse.json({ error: 'Project ID and Question ID are required' }, { status: 400 });
    }

    await prisma.researchQuestion.delete({
      where: {
        id: questionId,
        projectId: projectId,
      },
    });

    return NextResponse.json({ message: 'Research question deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting research question:', error);
    return NextResponse.json({ error: 'Failed to delete research question' }, { status: 500 });
  }
}
