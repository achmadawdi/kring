import { create } from "zustand";

export type WidgetType = "alert" | "goal" | "board";

export interface Widget {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  settings: Record<string, any>;
}

interface OverlayState {
  widgets: Widget[];
  setWidgets: (widgets: Widget[]) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  addWidget: (widget: Omit<Widget, "id">) => void;
  removeWidget: (id: string) => void;
}

export const useOverlayStore = create<OverlayState>((set) => ({
  widgets: [
    {
      id: "alert-1",
      type: "alert",
      x: 100,
      y: 100,
      width: 400,
      height: 300,
      visible: true,
      settings: {
        sound: "kring.mp3",
        image: "https://picsum.photos/seed/meme/400/300",
        message: "{name} just donated Rp {amount}!",
      },
    },
    {
      id: "goal-1",
      type: "goal",
      x: 100,
      y: 500,
      width: 400,
      height: 100,
      visible: true,
      settings: {
        title: "Beli Kopi",
        current: 50000,
        target: 100000,
      },
    },
  ],
  setWidgets: (widgets) => set({ widgets }),
  updateWidget: (id, updates) =>
    set((state) => ({
      widgets: state.widgets.map((w) =>
        w.id === id ? { ...w, ...updates } : w,
      ),
    })),
  addWidget: (widget) =>
    set((state) => ({
      widgets: [
        ...state.widgets,
        { ...widget, id: Math.random().toString(36).substr(2, 9) },
      ],
    })),
  removeWidget: (id) =>
    set((state) => ({
      widgets: state.widgets.filter((w) => w.id !== id),
    })),
}));
