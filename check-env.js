console.log('=== 环境变量检查 ===');
const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
required.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName}: 未设置`);
  } else {
    const displayValue = varName.includes('PASSWORD') ? '***' : value;
    console.log(`✅ ${varName}: ${displayValue}`);
  }
});

console.log('\n=== 当前环境 ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('HOST:', process.env.HOST);
