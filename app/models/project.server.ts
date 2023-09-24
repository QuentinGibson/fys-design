import { Prisma, Project } from "@prisma/client";
import invariant from "tiny-invariant";
import { prisma } from "~/db.server";
import { validateName } from "~/utils";
 {

  }
interface InputError {
  [key: string]: string
  
}

function isValidURL(url: string): boolean {
  const urlPattern = /^(http|https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(url);
}

function isValidSlug(slug: string): boolean {
  // Define a regular expression pattern for valid slugs (lowercase letters, numbers, hyphens)
  const slugPattern = /^[a-z0-9-]+$/;

  // Use the test method to check if the input string matches the pattern
  return slugPattern.test(slug);
}

function isValidSummary(summary: string, maxLength: number = 200): boolean {
  // Check if the summary is a non-empty string
  if (typeof summary !== "string" || summary.trim().length === 0) {
    return false;
  }

  // Check if the summary length is within the specified limit
  if (summary.length > maxLength) {
    return false;
  }

  // If all checks pass, the summary is considered valid
  return true;
}

function isValidContent(html: string): boolean {
  // Define a regular expression pattern to match potentially harmful tags and attributes
  const disallowedTags = /<\s*(script|iframe|object|embed|style|link|meta|base|form|input|textarea|button|select|optgroup|option|label|fieldset|legend|iframe|frameset|frame|object|embed|applet|audio|video|source|track|track|a|area|map|svg|math|canvas|details|summary|bgsound|head|html|body|xml|vbscript|javascript|data):/gi;
  const disallowedAttributes = /(on\w+=|data-|style=|href=|src=)/i;

  // Check for potentially harmful tags and attributes
  if (disallowedTags.test(html) || disallowedAttributes.test(html)) {
    return false;
  }

  return true
}

  function isValidImageFileName(fileName: string): boolean {
  // Define a list of allowed image file extensions (add more as needed)
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];

  // Get the file extension from the fileName
  const fileExtension = fileName.toLowerCase().slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);

  // Check if the file extension is in the list of allowed extensions
  return allowedExtensions.includes(`.${fileExtension}`);
}

export async function createProject(
  data: Prisma.ProjectCreateInput & { image: string | null }):
  Promise<[errors: InputError | null, project: Project | null]> {
  let errors: InputError | null = {}


  // Validate Input Data
  const {name, link, slug, summary, content, image} = data
  if (!validateName(name)) {
    errors.name = "Invalid Name. Please enter a different name!"
  }
  if (link && !isValidURL(link)) {
    errors.link = "Invalid Link. Please enter a valid link!"
  }
  if (!isValidSlug(slug)) {
    errors.slug = "Invalid Slug. Please remove invalid characters!"
  }
  if (!isValidSummary(summary)) {
    errors.summary = "Invalid Summary. Summary must be less than 200 characters!"
  }

  if (!isValidContent(content)) {
    errors.content =  "Invalid Content. Please try again!"
  }

  if (!isValidImageFileName(image)) {
    errors.image = "Error, Please enter a valid image file."
  }

  if (Object.keys(errors).length > 0) {
    return [errors, null]
  }

  // Call create Project
  const project = await prisma.project.create({data: data});
  return [null, project];
}

export async function getProjectBySlug(slug: string) {
  try {
    const project = await prisma.project.findUnique({ where: { slug }, include: { services: true, industries: true} });
    invariant(project, "Project not found!");
    return project;
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

export async function updateProjectBySlug(slug: string, data: Partial<Project>) {
  try {
    const project = await prisma.project.update({ where: { slug }, data })
    return { project }
  } catch (error: any) {
    console.error("Error updating project. Message: " + error.message)
    throw error
  }
}

export async function deleteProjectBySlug(slug: string):
  Promise<[errors: any, project: Project | null]> {
  
  try {
    const project = await prisma.project.delete({ where: { slug } });
    return [null, project]
  } catch (error: any) {

    return [error, null];
  }
}
