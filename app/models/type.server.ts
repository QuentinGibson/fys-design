import { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";
import { validateName } from "~/utils";

export async function createType(data: Prisma.TypeCreateInput) {
  const errors: InputError = {}
  const { name } = data
  if (!validateName(name)) {
    errors.name = "Invalid Name. Please enter another name!"
  }
  if (Object.keys(errors).length > 0) {
    return [errors, null]
  }
  const type = await prisma.type.create({ data });
  return [null, type];
}

export async function getTypeByID(id: string) {
  const type = await prisma.type.findUnique({ where: { id } });
  return type
}

export async function getTypes() {
  const types = prisma.type.findMany();
  return types;
}

export async function updateTypeByID(id: string, data: Prisma.TagUpdateInput) {
  const errors: InputError = {}
  const { name } = data
  if (!validateName(name)) {
    errors.name = "Invalid Name. Please enter another name!"
  }

  if (Object.keys(errors).length > 0) {
    return [errors, null]
  }

  const type = await prisma.type.update({ where: { id }, data });
  return [null, type];
}

export async function deleteTypeByID(id: string) {
  const type = await prisma.type.delete({ where: { id } });
  return [null, type]
}
