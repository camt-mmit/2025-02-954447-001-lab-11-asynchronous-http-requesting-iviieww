import { Pipe, PipeTransform } from '@angular/core';
import { extractId } from '../helpers';

@Pipe({
  name: 'extractIdPipe',
})
export class ExtractIdPipe implements PipeTransform {
  transform(value: string | null): string | null {
    if (value === null) {
      return null;
    } else {
      return extractId(value);
    }
  }
}
