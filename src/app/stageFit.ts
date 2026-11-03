interface Size {
  width: number;
  height: number;
}

export interface StageFit {
  scale: number;
  left: number;
  top: number;
}

/** The largest size the stage can take inside the viewport, centred, keeping its shape. */
export function fitStage(viewport: Size, stage: Size): StageFit {
  const scale = Math.min(viewport.width / stage.width, viewport.height / stage.height);
  return {
    scale,
    left: (viewport.width - stage.width * scale) / 2,
    top: (viewport.height - stage.height * scale) / 2,
  };
}
