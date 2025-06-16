import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string, questionId: string } }) {
  try {
    const { id: projectId, questionId } = params;

    if (!projectId || !questionId) {
      return NextResponse.json({ error: 'Project ID and Question ID are required' }, { status: 400 });
    }

    const bigQuestion = await prisma.bigQuestion.findUnique({
      where: {
        id: questionId,
        projectId: projectId,
      },
      include: {
        researchQuestions: {
          include: {
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
        }
      }
    });

    if (!bigQuestion) {
      return NextResponse.json({ error: 'Big question not found' }, { status: 404 });
    }

    return NextResponse.json(bigQuestion);
  } catch (error) {
    console.error('Error fetching big question:', error);
    return NextResponse.json({ error: 'Failed to fetch big question' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string, questionId: string } }) {
  try {
    const { id: projectId, questionId } = params;
    const { text } = await request.json();

    if (!projectId || !questionId) {
      return NextResponse.json({ error: 'Project ID and Question ID are required' }, { status: 400 });
    }
    if (!text) {
      return NextResponse.json({ error: 'Big question text is required' }, { status: 400 });
    }

    const updatedBigQuestion = await prisma.bigQuestion.update({
      where: {
        id: questionId,
        projectId: projectId,
      },
      data: {
        text,
      },
      include: {
        researchQuestions: true
      }
    });

    return NextResponse.json(updatedBigQuestion, { status: 200 });
  } catch (error) {
    console.error('Error updating big question:', error);
    return NextResponse.json({ error: 'Failed to update big question' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string, questionId: string } }) {
  try {
    const { id: projectId, questionId } = params;

    if (!projectId || !questionId) {
      return NextResponse.json({ error: 'Project ID and Question ID are required' }, { status: 400 });
    }

    await prisma.bigQuestion.delete({
      where: {
        id: questionId,
        projectId: projectId,
      },
    });

    return NextResponse.json({ message: 'Big question deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting big question:', error);
    return NextResponse.json({ error: 'Failed to delete big question' }, { status: 500 });
  }
}
