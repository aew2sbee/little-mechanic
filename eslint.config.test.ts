// @vitest-environment node
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

/** The rule ids ESLint reports for `code` as if it were the file at `filePath`. */
async function lint(code: string, filePath: string): Promise<(string | null)[]> {
  const eslint = new ESLint();
  const [result] = await eslint.lintText(code, { filePath });
  return result.messages.map((message) => message.ruleId);
}

describe('機能のあいだの import の境界', () => {
  it.each([
    ['別の機能の内部ファイル', 'src/features/garage/x.ts', "import '@/features/repair/screw';"],
    ['相対パスでの別の機能の内部ファイル', 'src/features/garage/x.ts', "import '../repair/screw';"],
    ['下の階層からの別の機能の内部ファイル', 'src/features/garage/parts/x.ts', "import '../../repair/screw';"],
    ['app からの機能の内部ファイル', 'src/app/x.ts', "import '@/features/repair/screw';"],
    ['機能から app', 'src/features/garage/x.ts', "import '@/app/App';"],
    ['shared から機能', 'src/shared/ui/x.ts', "import '@/features/repair';"],
    ['shared から相対パスで機能', 'src/shared/ui/x.ts', "import '../../features/repair';"],
    ['型だけの内部 import', 'src/features/garage/x.ts', "import type { T } from '@/features/repair/screw';\nexport type U = T;"],
  ])('%sを読み込むとき、検出される', async (_name, filePath, code) => {
    // Arrange
    const sut = lint;

    // Act
    const ruleIds = await sut(code, filePath);

    // Assert
    expect(ruleIds).toContain('no-restricted-imports');
  });

  it.each([
    ['別の機能の index', 'src/features/garage/x.ts', "import '@/features/repair';"],
    ['同じ機能の内部ファイル', 'src/features/garage/x.ts', "import './repairQueue';"],
    ['同じ機能の下の階層からの内部ファイル', 'src/features/garage/parts/x.ts', "import '../repairQueue';"],
    ['機能から shared', 'src/features/garage/x.ts', "import '@/shared/ui';"],
    ['app から機能の index', 'src/app/x.ts', "import '@/features/repair';"],
  ])('%sを読み込むとき、検出されない', async (_name, filePath, code) => {
    // Arrange
    const sut = lint;

    // Act
    const ruleIds = await sut(code, filePath);

    // Assert
    expect(ruleIds).not.toContain('no-restricted-imports');
  });
});
