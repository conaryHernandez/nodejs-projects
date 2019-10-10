node {
 stage('Prepare environment') {
      git branch: 'staging', url: 'https://github.com/conaryHernandez/nodejs-sandbox.git'
      sh 'npm install'
  }
  stage('Run tests')  {
      sh 'npm run test'
  }
  stage('Deploy') {
    sh 'ssh middletieruser@104.131.108.63 echo $JOB_NAME'
    sh 'ssh middletieruser@104.131.108.63 rm -rf /var/www/html/$JOB_NAME'
    sh 'ssh middletieruser@104.131.108.63 mkdir -p /var/www/html/$JOB_NAME'
    sh 'scp -r controllers data middleware models public routes utils views app.js LICENSE package.json middletieruser@104.131.108.63:/var/www/html/$JOB_NAME'
  }
  stage('setting Env Variables') {
    sh 'ssh middletieruser@104.131.108.63 "cd /var/www/html/$JOB_NAME && rm -rf .env"'
    sh 'ssh middletieruser@104.131.108.63 "cd /var/www/html/$JOB_NAME && touch .env"'
    sh 'ssh middletieruser@104.131.108.63 "cd /var/www/html/$JOB_NAME && echo "MONGO_USER=conaryh" >> .env "'
  }
  stage('Set Production Environment') {
    sh 'ssh middletieruser@104.131.108.63 "cd /var/www/html/$JOB_NAME && npm install && pm2 start app.js"'
  }
}