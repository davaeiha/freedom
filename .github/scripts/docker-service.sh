if [ ! "$(docker ps -a -q -f name=${1})" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=${1})" ]; then
        # cleanup
        docker rm ${1}
    fi
    case ${1} in
    'postgres_vbot')
        docker-compose -f docker-compose.db.yml up -d
        ;;
    'redis_vbot')
        docker-compose -f docker-compose.redis.yml up -d
        ;;
    'minio_vbot')
        docker-compose -f docker-compose.minio.yml up -d
        ;;
    'telegram_vbot')
        docker-compose -f docker-compose.yml up -d
        ;;
    esac
fi
