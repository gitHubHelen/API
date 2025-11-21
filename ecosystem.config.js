module.exports = {
  apps: [{
    name: 'babies-coding-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/babies-coding-api/err.log',
    out_file: '/var/log/babies-coding-api/out.log',
    log_file: '/var/log/babies-coding-api/combined.log',
    time: true,
    max_memory_restart: '1G',
    watch: false,
    ignore_watch: ['node_modules', 'logs'],
    instance_var: 'INSTANCE_ID'
  }]
};
