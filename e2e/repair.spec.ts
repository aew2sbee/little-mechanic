import { expect, test, type Locator, type Page } from '@playwright/test';

const centre = async (locator: Locator) => {
  const box = await locator.boundingBox();
  if (!box) throw new Error('element is not visible');
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
};

const toolTray = (page: Page) => page.getByRole('group', { name: 'こうぐ' });
const neededTool = (page: Page) => page.getByTestId('needed-tool').getAttribute('data-tool');

async function pickCorrectTool(page: Page) {
  await toolTray(page).locator(`[data-tool="${await neededTool(page)}"]`).tap();
}

async function touchEveryScrew(page: Page) {
  const screws = page.getByRole('button', { name: 'ねじ' });
  await expect(screws.first()).toBeVisible();
  while ((await screws.count()) > 0) {
    await screws.first().tap();
  }
}

async function dragNewPartIntoPlace(page: Page) {
  const from = await centre(page.getByTestId('new-part'));
  const to = await centre(page.getByTestId('part-slot'));
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 10 });
  await page.mouse.up();
}

async function rubOffTheDirt(page: Page) {
  const dirt = await page.getByTestId('dirt').boundingBox();
  if (!dirt) throw new Error('no dirt');
  for (let row = 0; row < 9; row += 1) {
    const y = dirt.y + (dirt.height * (row + 0.5)) / 9;
    await page.mouse.move(dirt.x, y);
    await page.mouse.down();
    await page.mouse.move(dirt.x + dirt.width, y, { steps: 8 });
    await page.mouse.up();
  }
}

const cars = (page: Page) => page.getByRole('button', { name: /なおす$/ });
const stickers = (page: Page) => page.getByRole('listitem', { name: /の しーる$/ });

test('修理を1件最後まで通したとき、シールがもらえて再読み込みしても残る', async ({ page }) => {
  // Arrange
  await page.goto('');
  await expect(cars(page)).toHaveCount(3);

  // Act
  await cars(page).first().tap();
  await pickCorrectTool(page);
  await touchEveryScrew(page);
  await expect(page.getByTestId('new-part')).toBeVisible();
  await dragNewPartIntoPlace(page);
  await touchEveryScrew(page);
  await expect(page.getByTestId('dirt')).toBeVisible();
  await rubOffTheDirt(page);
  await page.getByRole('button', { name: 'つぎへ' }).tap();

  // Assert
  await expect(cars(page)).toHaveCount(3);
  await page.reload();
  await page.getByRole('button', { name: 'しーる' }).tap();
  await expect(stickers(page)).toHaveCount(1);
});

/** Taps a tool that does not fit the shadow the vehicle shows. */
async function pickWrongTool(page: Page) {
  await toolTray(page).locator(`button:not([data-tool="${await neededTool(page)}"])`).first().tap();
}

test('まちがった工具を選んだとき、①困ったのまま先へ進まない', async ({ page }) => {
  // Arrange
  await page.goto('');
  await cars(page).first().tap();

  // Act
  await pickWrongTool(page);

  // Assert
  const tools = toolTray(page).getByRole('button');
  await expect(tools).toHaveCount(4);
  await expect(tools.first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'ねじ' })).toHaveCount(0);
});

test('まちがった工具を選んだあとでも、正しい工具を選んだとき②取り外しに進む', async ({ page }) => {
  // Arrange
  await page.goto('');
  await cars(page).first().tap();
  await pickWrongTool(page);

  // Act
  await pickCorrectTool(page);

  // Assert
  await expect(page.getByRole('button', { name: 'ねじ' }).first()).toBeVisible();
});

test('画面全体が縮小されていても、指の位置どおりに部品を動かせる', async ({ page }) => {
  // Arrange
  await page.setViewportSize({ width: 800, height: 500 });
  await page.goto('');
  await cars(page).first().tap();
  await pickCorrectTool(page);
  await touchEveryScrew(page);
  await expect(page.getByTestId('new-part')).toBeVisible();

  // Act
  await dragNewPartIntoPlace(page);

  // Assert
  await expect(page.getByRole('button', { name: 'ねじ' }).first()).toBeVisible();
});
