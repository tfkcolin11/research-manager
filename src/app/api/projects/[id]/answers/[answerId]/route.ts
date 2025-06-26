import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string, answerId: string }> }
) {
  const params = await props.params;
  try {
    const { id: projectId, answerId } = params;

    if (!projectId || !answerId) {
      return NextResponse.json({ error: 'Project ID and Answer ID are required' }, { status: 400 });
    }

    const answer = await prisma.answer.findUnique({
      where: {
        id: answerId,
        projectId: projectId,
      },
      include: {
        paper: true,
        researchQuestion: {
          include: {
            bigQuestion: true
          }
        }
      }
    });

    if (!answer) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }

    return NextResponse.json(answer);
  } catch (error) {
    console.error('Error fetching answer:', error);
    return NextResponse.json({ error: 'Failed to fetch answer' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string, answerId: string }> }
) {
  const params = await props.params;
  try {
    const { id: projectId, answerId } = params;
    const { text, location, paperId, researchQuestionId } = await request.json();

    if (!projectId || !answerId) {
      return NextResponse.json({ error: 'Project ID and Answer ID are required' }, { status: 400 });
    }
    if (!text) {
      return NextResponse.json({ error: 'Answer text is required' }, { status: 400 });
    }
    if (!paperId) {
      return NextResponse.json({ error: 'Paper ID is required' }, { status: 400 });
    }
    if (!researchQuestionId) {
      return NextResponse.json({ error: 'Research question ID is required' }, { status: 400 });
    }

    // Validate that paper belongs to the same project
    const paper = await prisma.paper.findUnique({
      where: { id: paperId, projectId: projectId }
    });
    if (!paper) {
      return NextResponse.json({ error: 'Invalid paper ID' }, { status: 400 });
    }

    // Validate that research question belongs to the same project
    const researchQuestion = await prisma.researchQuestion.findUnique({
      where: { id: researchQuestionId, projectId: projectId }
    });
    if (!researchQuestion) {
      return NextResponse.json({ error: 'Invalid research question ID' }, { status: 400 });
    }

    const updatedAnswer = await prisma.answer.update({
      where: {
        id: answerId,
        projectId: projectId,
      },
      data: {
        text,
        location: location || null,
        paperId,
        researchQuestionId,
      },
      include: {
        paper: true,
        researchQuestion: {
          include: {
            bigQuestion: true
          }
        }
      }
    });

    return NextResponse.json(updatedAnswer, { status: 200 });
  } catch (error) {
    console.error('Error updating answer:', error);
    return NextResponse.json({ error: 'Failed to update answer' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string, answerId: string }> }
) {
  const params = await props.params;
  try {
    const { id: projectId, answerId } = params;

    if (!projectId || !answerId) {
      return NextResponse.json({ error: 'Project ID and Answer ID are required' }, { status: 400 });
    }

    await prisma.answer.delete({
      where: {
        id: answerId,
        projectId: projectId,
      },
    });

    return NextResponse.json({ message: 'Answer deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting answer:', error);
    return NextResponse.json({ error: 'Failed to delete answer' }, { status: 500 });
  }
}
