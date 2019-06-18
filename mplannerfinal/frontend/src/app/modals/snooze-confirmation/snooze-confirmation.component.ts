import { Component, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-snooze-confirmation',
  templateUrl: './snooze-confirmation.component.html',
  styleUrls: ['./snooze-confirmation.component.css']
})
export class SnoozeConfirmationComponent {
  @ViewChild('openBtn') openBtn: ElementRef;
  @Output() onAddSnooze: EventEmitter<any> = new EventEmitter<any>();
  event: any;
  count: number;
  openModal(event: any, count: number): void {
    this.event = event;
    this.count = count;
    this.openBtn.nativeElement.click();
  }

  addSnooze(): void {
    this.onAddSnooze.emit({event: this.event, count: this.count + 1});
  }
}
