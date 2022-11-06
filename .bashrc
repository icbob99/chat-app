#!/bin/bash

#for docker-compse
export COMPOSE_TLS_VERSION=TLSv1_2

export GATLING_HOME=/c/gatling-3.3.1

function docker-compose-run() {
        #if [ "$1" = "-f" ] || [ "$1" = "--file" ] ; then
		if [ "$1" = "-p" ] ; then
                docker exec -i $(docker-compose -p $2 ps $3 |grep -m 1 $3 | cut -d ' ' -f1) "${@:4}"
        else
                docker exec -i $(docker-compose ps $1 | grep -m 1 $1 | cut -d ' ' -f1) "${@:2}"
        fi
}

function pipelog(){
	branch=$(git rev-parse --abbrev-ref HEAD | sed -e 's/\W/-/g')
	cmd=$(echo $2 | sed -e 's/\W/-/g')
	log='pipe-'$branch'_'$cmd'.log'
	echo -e "\033[35mpiping to $log"
	exec $@ | tee "$log"
}

function searchAndCheckout(){
   eval $(git branch | grep $@|sed -e 's/* \|  /gco /g')
}

function getversion(){
    cat ./package.json | awk '/version/ {print "ros:"$2}' | sed 's/[",]//g'
}

#docker-compose-run "$@"
alias g='git'
alias loadrc='. ~/.bashrc'
alias gco='git checkout'
alias st='git status'
alias fetch='git fetch -p'
#k8s
alias k="kubectl"
#alias ros='cd /c/tabit/sources/ros'
alias ros='cd /c/tabit/ros'
alias loyalty='cd /c/tabit/loyalty/tabit-loyalty-main'
alias email='cd /c/tabit/loyalty/AFEmailSender'
alias afcore='cd /c/tabit/loyalty/TabitLoyaltyAFCore'
alias push="git push --follow-tags"
alias gf='git flow'
alias gff='git flow feature'
alias gfind="git branch | grep "
alias gfinda="git branch -a | grep "
alias gcon='searchAndCheckout'
alias pullpush='git pull && git push'
alias smartpull='git stash && git pull && git stash pop'
alias gcpc='git cherry-pick --continue'
alias resetup='git reset --hard @{u}'


### SETUP GIT ALIASES --> most from here: https://hackernoon.com/lesser-known-git-commands-151a1918a60
git config --global alias.please 'push --force-with-lease'
git config --global alias.commend 'commit --amend --no-edit'
git config --global alias.empty 'commit --allow-empty'
git config --global alias.stsh 'stash --keep-index' # stash only unstaged changes to tracked files
git config --global alias.staash 'stash --include-untracked' # stash untracked and tracked files
git config --global alias.staaash 'stash --all' # stash ignored, untracked, and tracked files 
git config --global alias.st 'status --short --branch'
git config --global alias.merc 'merge --no-ff' # override the default --ff option
git config --global alias.grog 'log --graph --abbrev-commit --decorate --format=format:"%C(bold blue)%h%C(reset) - %C(bold cyan)%aD%C(dim white) - %an%C(reset) %C(bold green)(%ar)%C(reset)%C(bold yellow)%d%C(reset)%n %C(white)%s%C(reset)"' # replace the standard "git log"
git config --global alias.resetup 'merge reset --hard @{u}' # reset the current branch to its upstream

mergeto(){
	current=$(git branch | grep "*" | sed -e 's/* //g')
	gco $1 && git pull && git merge $current
}

mergefrom(){
	#set -x
	current=$(git branch | grep "*" | sed -e 's/* //g')
	gco $1 && git pull && gco $current && git merge $1
	#set +x
}

pull(){
	if [ -z "$1" ]
	then
		  fetch && git merge
	else
		current=$(git branch | grep "*" | sed -e 's/* //g') 
		gco $1 && fetch && git merge && gco $current
	fi
}

#ROS
alias deploy-int-sync-workers='git push origin HEAD:il-int-sync-worker && git push origin HEAD:ecs-us-int-sync-worker'
alias deploy-int='git push origin HEAD:il-int && git push origin HEAD:us-int'
alias deploy-int-il='git push origin HEAD:il-int'
alias deploy-int-us='git push origin HEAD:us-int'
alias deploy-int-force='git push origin HEAD:il-int -f && git push origin HEAD:us-int -f'
alias deploy-staging='git push origin HEAD:il-staging && git push origin HEAD:us-staging'

alias deploy-prod-us-processors='git push origin HEAD:us-prod-processors'
alias deploy-prod-us-beta='git push origin HEAD:us-prod-beta-rp && git push origin HEAD:us-prod-beta-main && git push origin HEAD:us-prod-beta-event-listener'
alias deploy-prod-us-ga='git push origin HEAD:us-prod-main && git push origin HEAD:us-prod-rp && git push origin HEAD:us-prod-worker && git push origin HEAD:us-demo'

alias deploy-prod-il-processors='git push origin HEAD:il-prod-processors'
alias deploy-prod-il-bridges='git push origin HEAD:il-prod-bridges'
alias deploy-prod-il-beta='git push origin HEAD:il-prod-beta-main && git push origin HEAD:il-prod-beta-rp && git push origin HEAD:il-prod-beta-event-listener'
alias deploy-prod-il-tad='git push origin HEAD:il-prod-tad'
alias deploy-prod-il-ga='git push origin HEAD:il-prod-main && git push origin HEAD:il-prod-rp && git push origin HEAD:il-prod-worker && git push origin HEAD:il-prod-event-listener'
alias deploy-prod-il-alpha='git push origin HEAD:il-prod-alpha-main && git push origin HEAD:il-prod-alpha-rp'

#GATLING
alias gatling-build-and-test='sbt compile && sbt gatling:test'

#MONGO
alias tail-mongo-log="tail -f '/c/Program Files/MongoDB/Server/4.0/log/mongod.log'"

#ordered colored local branches  
#alias recent="git for-each-ref --sort=-committerdate refs/heads --format='%(HEAD)%(color:yellow)%(refname:short)|%(color:bold green)%(committerdate:relative)|%(color:blue)%(subject)|%(color:magenta)%(authorname)%(color:reset)' --color=always --count=10 | column -ts'|'"
alias recent="git for-each-ref --sort=-committerdate refs/heads --format='%(HEAD)%(color:yellow)%(refname:short)|%(color:bold green)%(committerdate:relative)|%(color:blue)%(subject)|%(color:magenta)%(authorname)%(color:reset)' --color=always | column -ts'|'"


#alias recentb="!r() { refbranch=$1 count=$2; git for-each-ref --sort=-committerdate refs/heads --format='%(refname:short)|%(HEAD)%(color:yellow)%(refname:short)|%(color:bold green)%(committerdate:relative)|%(color:blue)%(subject)|%(color:magenta)%(authorname)%(color:reset)' --color=always --count=${count:-20} | while read line; do branch=$(echo \"$line\" | awk 'BEGIN { FS = \"|\" }; { print $1 }' | tr -d '*'); ahead=$(git rev-list --count \"${refbranch:-origin/master}..${branch}\"); behind=$(git rev-list --count \"${branch}..${refbranch:-origin/master}\"); colorline=$(echo \"$line\" | sed 's/^[^|]*|//'); echo \"$ahead|$behind|$colorline\" | awk -F'|' -vOFS='|' '{$5=substr($5,1,70)}1' ; done | ( echo \"ahead|behind||branch|lastcommit|message|author\\n\" && cat) | column -ts'|';}; r"


function runRos(){
    node --inspect inpact.js
}
function ros-il-int(){
    echo -e $BOND
    unset defaultRegion
    export MONGO_URI="mongodb://int-rw:int-rw@int-stg-dev-shard-00-00-fhv7t.mongodb.net:27017,int-stg-dev-shard-00-01-fhv7t.mongodb.net:27017,int-stg-dev-shard-00-02-fhv7t.mongodb.net:27017/tabit?ssl=true&replicaSet=INT-STG-DEV-shard-0&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1"
    export ANALYTICS_URI="mongodb+srv://analytics:analytics@staging-analytics-fhv7t.mongodb.net/tabit?replicaSet=staging-analytics-shard-0&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1"
    #export SQL_CONNECTION=mssql://shmuel:Simw1234@dwh-isr-int.database.windows.net/dwhTabit?encrypt=true
export REDIS_URL="redis://redis-il-int-cluster.e0xdsx.clustercfg.euw1.cache.amazonaws.com:6379"
runRos
}

# function ros-us-int(){
    # export defaultRegion='US'
    # export MONGO_URI="mongodb://admin:tabitros@us-test-envs-shard-00-01-z3gk6.mongodb.net:27017,us-test-envs-shard-00-00-z3gk6.mongodb.net:27017,us-test-envs-shard-00-02-z3gk6.mongodb.net:27017/tabit-int?ssl=true&replicaSet=US-TEST-ENVS-shard-0&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1"
    # export ANALYTICS_URI="mongodb+srv://admin:tabitros@us-test-envs-z3gk6.mongodb.net/tabit-int?retryWrites=true&w=majority"
    # runRos
# }

 function ros-us-int(){
	export defaultRegion='US'
	export MONGO_URI="mongodb://ros-us-int:hGmktt3978wnU7aT@int-stg-dev-shard-00-00-fhv7t.mongodb.net:27017,int-stg-dev-shard-00-01-fhv7t.mongodb.net:27017,int-stg-dev-shard-00-02-fhv7t.mongodb.net:27017/tabit-us-int?ssl=true&replicaSet=INT-STG-DEV-shard-0&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1"
	export ANALYTICS_URI="mongodb+srv://admin:tabitros@us-test-envs-z3gk6.mongodb.net/tabit-int?retryWrites=true&w=majority"
	runRos
 }


