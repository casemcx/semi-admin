import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { parallel, series } from 'gulp';

const execAsync = promisify(exec);

// 清理 dist 目录
async function clean() {
  try {
    await execAsync('rm -rf dist');
    console.log('✓ Cleaned dist directory');
  } catch (error) {
    // 忽略目录不存在的错误
    console.log('✓ Dist directory already clean');
  }
}

// 构建 JS 库
async function buildLib() {
  try {
    console.log('Building library...');
    await execAsync('npm run build:lib');
    console.log('✓ Library built successfully');
  } catch (error) {
    console.error('✗ Library build failed:', error.message);
    throw error;
  }
}

// 构建 CSS
async function buildCss() {
  try {
    console.log('Building CSS...');
    await execAsync('npm run build:css');
    console.log('✓ CSS built successfully');
  } catch (error) {
    console.error('✗ CSS build failed:', error.message);
    throw error;
  }
}

// 开发模式 - 构建后监听变化
async function dev() {
  try {
    // 先构建一次
    await series(clean, buildLib, buildCss)();

    console.log('\n🚀 Starting development mode...\n');

    // 启动 CSS 监听
    const cssProcess = exec('npm run dev:css');
    cssProcess.stdout?.on('data', data => {
      console.log(`[CSS] ${data.trim()}`);
    });
    cssProcess.stderr?.on('data', data => {
      console.error(`[CSS Error] ${data.trim()}`);
    });

    // 启动 JS 监听
    const jsProcess = exec('npm run build:lib --watch');
    jsProcess.stdout?.on('data', data => {
      console.log(`[JS] ${data.trim()}`);
    });
    jsProcess.stderr?.on('data', data => {
      console.error(`[JS Error] ${data.trim()}`);
    });

    // 处理进程退出
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping development mode...');
      cssProcess.kill();
      jsProcess.kill();
      process.exit();
    });
  } catch (error) {
    console.error('✗ Development mode failed:', error.message);
    throw error;
  }
}

// 导出任务
export { clean, buildLib, buildCss, dev };

// 默认任务 - 串行构建
export const build = series(clean, buildLib, buildCss);

// 开发任务
export const develop = dev;
