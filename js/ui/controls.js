import { elements } from "../dom/elements.js";
import { state } from "../state.js";
import { applySpeed } from "../audio/player.js";
import { updateFont } from "./renderer.js";

export function setSpeed(value) {
    if (!elements.playbackSpeedRange) return;
    const speed = Math.min(5.0, Math.max(0.5, value));

    elements.playbackSpeedRange.value = speed;
    if (elements.speedValueDisplay) {
        elements.speedValueDisplay.textContent = `${speed.toFixed(2).replace(/\.?0+$/, "")}x`;
    }
    applySpeed();
    updateSpeedButtonUI(speed);
}

function updateSpeedButtonUI(speed) {
    elements.speedPresetButtons?.forEach(btn => {
        const active = parseFloat(btn.dataset.speed) === speed;
        btn.classList.toggle("bg-emerald-600", active);
        btn.classList.toggle("text-white", active);
        btn.classList.toggle("border-emerald-600", active);
        btn.classList.toggle("font-bold", active);
        btn.classList.toggle("bg-white", !active);
        btn.classList.toggle("text-slate-600", !active);
        btn.classList.toggle("border-slate-200", !active);
    });
}

export function updateLoopCounterUI() {
    if (!elements.currentLoopCounter) return;
    const total = state.targetLoopCount === Infinity ? "∞" : state.targetLoopCount;
    elements.currentLoopCounter.textContent = `${state.currentLoop} / ${total}`;
}

export function bindControlEvents() {
    elements.fontStyleSelect?.addEventListener("change", e => {
        state.selectedFont = e.target.value;
        updateFont();
    });

    elements.fontSizeRange?.addEventListener("input", e => {
        const size = `${e.target.value}rem`;
        document.documentElement.style.setProperty("--arabic-word-size", size);
        if (elements.fontSizeDisplay) elements.fontSizeDisplay.textContent = size;
    });

    elements.playbackSpeedRange?.addEventListener("input", e => {
        const v = parseFloat(e.target.value);
        if (!isNaN(v)) setSpeed(v);
    });

    elements.speedPresetButtons?.forEach(btn =>
        btn.addEventListener("click", e => {
            const v = parseFloat(e.currentTarget.dataset.speed);
            if (!isNaN(v)) setSpeed(v);
        })
    );
}

export function initDefaultSpeed() {
    const v = parseFloat(elements.playbackSpeedRange?.value) || 1.0;
    setSpeed(v);
}