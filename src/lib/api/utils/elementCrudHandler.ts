import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getToken } from "next-auth/jwt";
import {
  createElement,
  updateElement,
  deleteElement,
} from "@/lib/api/utils/elementUtils";
import { createSuccessResponse, createErrorResponse } from "@/lib/api/utils";
import type { ElementType } from "@/lib/api/types";

const secret = process.env.NEXTAUTH_SECRET;

async function requireAdmin(request: NextRequest) {
  const token = await getToken({ req: request, secret });
  if (!token) {
    return NextResponse.json(createErrorResponse("Not authenticated"), {
      status: 401,
    });
  }
  if (token.role !== "admin") {
    return NextResponse.json(createErrorResponse("Not authorized"), {
      status: 403,
    });
  }
  return null;
}

interface CrudHandlerConfig<T extends z.ZodType> {
  elementType: ElementType;
  schema: T;
  enhancer?: (data: z.infer<T>) => Record<string, unknown>;
}

export function createElementCrudHandler<T extends z.ZodType>({
  elementType,
  schema,
  enhancer,
}: CrudHandlerConfig<T>) {
  const POST = async (request: NextRequest) => {
    const auth = await requireAdmin(request);
    if (auth) return auth;
    try {
      const body = await request.json();
      const parsed = schema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(createErrorResponse("Validation failed"), {
          status: 400,
        });
      }

      const elementData = enhancer
        ? { ...parsed.data, ...enhancer(parsed.data) }
        : parsed.data;

      const result = await createElement(elementType, elementData);

      return NextResponse.json(
        createSuccessResponse(result, `${elementType} created successfully`, {
          type: elementType,
          timestamp: new Date().toISOString(),
        }),
      );
    } catch (error) {
      return NextResponse.json(
        createErrorResponse(
          error instanceof Error ? error.message : "Failed to create element",
        ),
        { status: 500 },
      );
    }
  };

  const PUT = async (request: NextRequest) => {
    const auth = await requireAdmin(request);
    if (auth) return auth;
    try {
      const body = await request.json();
      const parsed = schema.safeParse(body);

      if (!parsed.success) {
        return NextResponse.json(createErrorResponse("Validation failed"), {
          status: 400,
        });
      }

      if (!parsed.data._id) {
        return NextResponse.json(
          createErrorResponse("Element ID is required"),
          { status: 400 },
        );
      }

      const { _id, ...updateData } = parsed.data;
      const elementData = enhancer
        ? { ...updateData, ...enhancer(parsed.data) }
        : updateData;

      const result = await updateElement(_id, elementData);

      return NextResponse.json(
        createSuccessResponse(result, `${elementType} updated successfully`, {
          type: elementType,
          timestamp: new Date().toISOString(),
        }),
      );
    } catch (error) {
      return NextResponse.json(
        createErrorResponse(
          error instanceof Error ? error.message : "Failed to update element",
        ),
        { status: 500 },
      );
    }
  };

  const DELETE = async (request: NextRequest) => {
    const auth = await requireAdmin(request);
    if (auth) return auth;
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get("id");

      if (!id) {
        return NextResponse.json(
          createErrorResponse("Element ID is required"),
          { status: 400 },
        );
      }

      const result = await deleteElement(id);

      return NextResponse.json(
        createSuccessResponse(result, `${elementType} deleted successfully`, {
          type: elementType,
          timestamp: new Date().toISOString(),
        }),
      );
    } catch (error) {
      return NextResponse.json(
        createErrorResponse(
          error instanceof Error ? error.message : "Failed to delete element",
        ),
        { status: 500 },
      );
    }
  };

  return { POST, PUT, DELETE };
}
