import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(req)

  if (!user) {
    return NextResponse.json({message: 'Acesso negado'}, {status: 403})
  }

  const { id } = await params

  const canvas = await prisma.canvas.findUnique({ where: { id } })

  if (!canvas) {
    return NextResponse.json({ message: 'Quadro não encontrado' }, { status: 404 })
  }

  return NextResponse.json(canvas)
}


// CRIAR FUNÇÃO DE PATCH


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = getUserFromRequest(req)

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({message: 'Acesso negado'}, {status: 403})
  }

  const { id } = await params

  const existingCanvas = await prisma.canvas.findUnique({where: {id}})
  if (!existingCanvas) {
    return NextResponse.json({ message: 'Quadro não encontrado' }, { status: 404 })
  }

  await prisma.canvas.delete({ where: { id } })
    return NextResponse.json({ message: 'Quadro removido com sucesso' }, {status: 200})
}