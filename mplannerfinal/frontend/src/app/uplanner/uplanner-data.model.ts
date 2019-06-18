export interface Events {
    id: String,
    start: Date,
    end: Date,
    title: String,
    color: Object,
    allDay: Boolean,
    draggable: Boolean,
    resizable: {
        beforeStart: Boolean,
        afterEnd: Boolean
    }
}