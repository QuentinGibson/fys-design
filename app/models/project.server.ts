import invariant from "tiny-invariant";
import { prisma } from "~/db.server";

export async function createProject(data: any) {
  try {
    const project = await prisma.project.create(data);
    return { project };
  } catch (error: any) {
    console.error("Error creating project. Message: " + error.message);
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const project = await prisma.project.findUnique({ where: { slug }, include: { services: true, industries: true} });
    invariant(project, "Project not found!");
    return { project };
  } catch (error: any) {
    console.error("Error fetching project. Message: " + error.message);
  }
}

export async function getProjectByID(id: string) {
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    invariant(project, "Project not found!");
    return { project };
  } catch (error: any) {
    console.error("Error fetching project. Message: " + error.message);
  }
}

export async function getLatestProjects() {
  try {
    const projects = await prisma.project.findMany({
      take: 5,
      orderBy: {
        created_at: "desc",
      },
    });
    return  projects ;
  } catch (error: any) {
    console.error("Error fetching latest projects. Message: " + error.message);
  }
}

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany();
    return { projects };
  } catch (error: any) {
    console.error("Error fetching all projects. Message: " + error.message);
  }
}

export async function updateProjectBySlug(slug: string, data: any) {
  try {
    const project = await prisma.project.update({ where: { slug }, data });
    return { project };
  } catch (error: any) {
    console.error("Error updating project. Message: " + error.message);
  }
}

export async function deleteProjectByID(id: string) {
  try {
    const project = await prisma.project.delete({ where: { id } });
    return { project };
  } catch (error: any) {
    console.error("Error deleting project. Message: " + error.message);
  }
}
