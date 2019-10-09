node {
   stage('Prepare environment') {
        git branch: 'staging', url: 'https://github.com/conaryHernandez/nodejs-sandbox.git'
        sh 'npm install'
    }
    stage('Run tests')  {
        sh 'npm run test'
    }

// shop/staging
    stage('Deploy') {
        sh 'echo $JOB_NAME'
        sh 'ssh middletieruser@104.131.108.63 echo $JOB_NAME'
        sh 'ssh middletieruser@104.131.108.63 rm -rf /var/www/html/$JOB_NAME' // borrar todo el folder
        sh 'ssh middletieruser@104.131.108.63 mkdir -p /var/www/html/$JOB_NAME' // reacreando el folder
        sh 'scp -r controllers data middleware models public routes utils views middletieruser@104.131.108.63:/var/www/html/$JOB_NAME' // 
        sh 'ssh middletieruser@104.131.108.63 "mv /var/www/html/$JOB_NAME/* /var/www/html/$JOB_NAME"'
        sh 'ssh middletieruser@104.131.108.63 rm -rf /var/www/html/$JOB_NAME/'
        sh 'ssh middletieruser@104.131.108.63 ls /var/www/html/ -a'
    }
}