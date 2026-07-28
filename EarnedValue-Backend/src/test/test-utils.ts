import type { NextFunction, Request, Response } from "express";

export const createMockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  return res as unknown as Response;
};

export const createMockRequest = (overrides: Partial<Request> = {}): Request =>
  ({
    body: {},
    params: {},
    headers: {},
    ...overrides,
  }) as Request;

export const createMockNext = (): NextFunction => jest.fn();
