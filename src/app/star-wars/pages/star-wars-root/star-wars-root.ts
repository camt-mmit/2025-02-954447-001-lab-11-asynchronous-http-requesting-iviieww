import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ModuleRoute } from '../../tokens';

@Component({
  selector: 'app-star-wars-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './star-wars-root.html',
  styleUrl: './star-wars-root.scss',
  providers: [{ provide: ModuleRoute, useFactory: () => inject(ActivatedRoute) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarWarsRoot {}
