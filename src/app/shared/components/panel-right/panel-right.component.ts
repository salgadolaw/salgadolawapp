import { NgClass, NgIf } from '@angular/common';
import { Component, effect, EventEmitter, HostListener, Input, input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-panel-right',
  imports: [ NgClass],
  templateUrl: './panel-right.component.html',
  styleUrls: ['./panel-right.component.scss'],

})
export class PanelRightComponent {

  private _opened = signal(false);
  fullscreen = signal(false);


  @Input() zIndex = 3000;
  @Input() leftOffset = 0;
  @Input() title = '';
  @Input() closeOnBackdrop = true;


private readonly minWidth = 260;
private readonly defaultWidth = 700;
panelWidth = signal(this.defaultWidth);

  @Input()
  set opened(value: boolean) {
    this._opened.set(value);
     if (value) {
      this.fullscreen.set(false);
      this.panelWidth.set(this.defaultWidth);
    }
  }
  get opened(): boolean {
    return this._opened();
  }

  @Output() openedChange = new EventEmitter<boolean>();
  @Output() fullscreenChange = new EventEmitter<boolean>();

  // Resize drag
  private resizing = false;
  private resizeStartX = 0;

  open(): void {
    if (!this.opened) {
      this._opened.set(true);
      this.fullscreen.set(false);
      this.panelWidth.set(this.defaultWidth);
      this.openedChange.emit(true);
    }
  }

  close(): void {
    if (!this.opened) return;
    this._opened.set(false);
    this.fullscreen.set(false);
    this.openedChange.emit(false);
    this.fullscreenChange.emit(false);
  }

  toggleFullscreen(): void {
    if (!this.opened) return;
    const next = !this.fullscreen();
    this.fullscreen.set(next);
    if (!next) {
      this.panelWidth.set(this.defaultWidth);
    }
    this.fullscreenChange.emit(next);
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) this.close();
  }

  // START resize desde el borde izquierdo
  onResizeHandleDown(event: MouseEvent | TouchEvent): void {
    if (!this.opened || this.fullscreen()) return;
    event.stopPropagation();
    event.preventDefault();
    this.resizing = true;
    this.resizeStartX = this.getClientX(event);
  }

  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:touchmove', ['$event'])
  onPointerMove(event: MouseEvent | TouchEvent): void {
    if (!this.resizing || !this.opened || this.fullscreen()) return;

    const clientX = this.getClientX(event);
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth || 0;

    const newWidth = this.clampWidth(viewportWidth - clientX);

    this.panelWidth.set(newWidth);

    // si casi no queda ancho → cerramos
    if (newWidth < 80) {
      this.resizing = false;
      this.close();
    }
  }

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  onPointerUp(): void {
    this.resizing = false;
  }

  private clampWidth(width: number): number {
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth || 0;

    const max = viewportWidth; // puede crecer hasta full
    if (width < this.minWidth) return this.minWidth;
    if (width > max) return max;
    return width;
  }

  private getClientX(event: MouseEvent | TouchEvent): number {
    if (event instanceof MouseEvent) return event.clientX;
    const t = event.touches[0] ?? event.changedTouches[0];
    return t?.clientX ?? 0;
  }

  // transform según estado
  getTransform(): string {
    if (!this.opened) return 'translateX(100%)';

    if (this.fullscreen()) return 'translateX(0)';

    // abierto con ancho variable, pegado a la derecha
    return 'translateX(0)';
  }

}




