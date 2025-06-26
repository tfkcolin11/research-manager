import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string, relationshipId: string }> }
) {
  const params = await props.params;
  try {
    const { id: projectId, relationshipId } = params;

    if (!projectId || !relationshipId) {
      return NextResponse.json({ error: 'Project ID and Relationship ID are required' }, { status: 400 });
    }

    const relationship = await prisma.paperRelationship.findUnique({
      where: {
        id: relationshipId,
        projectId: projectId,
      },
      include: {
        paperA: true,
        paperB: true
      }
    });

    if (!relationship) {
      return NextResponse.json({ error: 'Relationship not found' }, { status: 404 });
    }

    return NextResponse.json(relationship);
  } catch (error) {
    console.error('Error fetching relationship:', error);
    return NextResponse.json({ error: 'Failed to fetch relationship' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string, relationshipId: string }> }
) {
  const params = await props.params;
  try {
    const { id: projectId, relationshipId } = params;
    const { paperAId, paperBId, type, notes } = await request.json();

    if (!projectId || !relationshipId) {
      return NextResponse.json({ error: 'Project ID and Relationship ID are required' }, { status: 400 });
    }
    if (!paperAId) {
      return NextResponse.json({ error: 'Paper A ID is required' }, { status: 400 });
    }
    if (!paperBId) {
      return NextResponse.json({ error: 'Paper B ID is required' }, { status: 400 });
    }
    if (!type) {
      return NextResponse.json({ error: 'Relationship type is required' }, { status: 400 });
    }
    if (paperAId === paperBId) {
      return NextResponse.json({ error: 'A paper cannot have a relationship with itself' }, { status: 400 });
    }

    // Validate relationship type
    const validTypes = ['SUPPORTS', 'CONTRADICTS', 'COMPLEMENTS', 'EXTENDS', 'IS_EXTENDED_BY', 'USES_METHODOLOGY_OF'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid relationship type' }, { status: 400 });
    }

    // Validate that both papers belong to the same project
    const paperA = await prisma.paper.findUnique({
      where: { id: paperAId, projectId: projectId }
    });
    if (!paperA) {
      return NextResponse.json({ error: 'Invalid Paper A ID' }, { status: 400 });
    }

    const paperB = await prisma.paper.findUnique({
      where: { id: paperBId, projectId: projectId }
    });
    if (!paperB) {
      return NextResponse.json({ error: 'Invalid Paper B ID' }, { status: 400 });
    }

    const updatedRelationship = await prisma.paperRelationship.update({
      where: {
        id: relationshipId,
        projectId: projectId,
      },
      data: {
        paperAId,
        paperBId,
        type,
        notes: notes || null,
      },
      include: {
        paperA: true,
        paperB: true
      }
    });

    return NextResponse.json(updatedRelationship, { status: 200 });
  } catch (error: any) {
    console.error('Error updating relationship:', error);
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'This relationship already exists between these papers' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update relationship' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string, relationshipId: string }> }
) {
  const params = await props.params;
  try {
    const { id: projectId, relationshipId } = params;

    if (!projectId || !relationshipId) {
      return NextResponse.json({ error: 'Project ID and Relationship ID are required' }, { status: 400 });
    }

    await prisma.paperRelationship.delete({
      where: {
        id: relationshipId,
        projectId: projectId,
      },
    });

    return NextResponse.json({ message: 'Relationship deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting relationship:', error);
    return NextResponse.json({ error: 'Failed to delete relationship' }, { status: 500 });
  }
}
