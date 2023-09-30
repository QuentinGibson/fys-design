import { prisma } from "~/db.server";

export async function createType(data: any) {
  try {
    const type = prisma.type.create(data);
    return { type };
  } catch (error: any) {
    console.error("Error creating type. Message: " + error.message);
  }
}

export async function getTypeByID(id: string) {
  try {
    const type = prisma.type.findUnique({ where: { id } });
    return { type };
  } catch (error: any) {
    console.error("Error fidning type. Message: " + error.message);
  }
}

export async function getTypes() {
  const types = prisma.type.findMany();
  return types;
}

export async function updateTypeByID(id: string, data: any) {
  try {
    const type = prisma.type.update({ where: { id }, data });
    return { type };
  } catch (error: any) {
    console.error("Error updating type. Message: " + error.message);
  }
}

export async function deleteTypeByID(id: string) {
  try {
    const type = prisma.type.delete({ where: { id } });
    return { type };
  } catch (error: any) {
    console.error("Error deleting type. Message: " + error.message);
  }
}
