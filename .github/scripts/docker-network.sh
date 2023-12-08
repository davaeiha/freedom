network=$(docker network ls | awk 'NR > 1 {print $2}' | grep -w ${1})

if [ -z $network ]; then
    docker network create ${1}
fi
