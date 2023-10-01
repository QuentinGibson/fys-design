import { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";
import { validateName } from "~/utils";

export async function createTag(data: any) {
  const errors: InputError = {}
  const { name } = data
  if (!validateName(name)) {
    errors.name = "Invalid Name. Please enter a different name!"
  }

  if (Object.keys(errors).length > 0) {
    return [errors, null]
  }
  const tag = await prisma.tag.create({ data: data });
  return [null, tag];
}

export async function getTagByID(id: string) {
  const tag = await prisma.tag.findUnique({ where: { id } });
  return tag;
}

export async function getTags() {
  const tags = prisma.tag.findMany();
  return tags;
}

export async function updateTagByID(id: string, data: Prisma.TagUpdateInput) {
  const errors: InputError = {}
  const { name } = data
  if (!validateName(name)) {
    errors.name = "Invalid Name. Please enter a different name!"
  }

  if (Object.keys(errors).length > 0) {
    return [errors, null]
  }

  const tag = await prisma.tag.update({ where: { id }, data });
  return [null, tag]
}

export async function deleteTagByID(id: string) {
  const tag = await prisma.tag.delete({ where: { id } });
  return [null, tag];
}
