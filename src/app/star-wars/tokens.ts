import { InjectionToken } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export const ModuleRoute = new InjectionToken<ActivatedRoute>('module-route');
