import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { personResource } from '../../helpers';
import { PersonView } from '../../component/person-view/person-view';
import { ModuleRoute } from '../../tokens';

@Component({
  selector: 'app-person-view-page',
  imports: [PersonView],
  templateUrl: './person-view-page.html',
  styleUrl: './person-view-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonViewPage {
  readonly id = input.required<string>();

  protected readonly moduleRoute = inject(ModuleRoute);

  readonly dataResource = personResource(() => this.id());

  protected goback() {
    history.back();
  }
}
