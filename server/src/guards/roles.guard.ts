import { ROLES_KEY } from './../constants/roles.constant';

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Guard Implementation for account roles.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Fetch all available roles on an endpoint
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If it does not exist, return true.
    if (!requiredRoles) {
      return true;
    }

    // Fetch user from the request.
    const { user } = context.switchToHttp().getRequest();

    // Return if user is allowed to access the resource.
    return requiredRoles.some((role) => user.role === role);
  }
}
