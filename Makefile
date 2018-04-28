.PHONY:*
prodNodeEnv:=$(shell cat Makefile.rsync.env.private 2>&1)

gulp:
	@ gulp
build:
	@ bash config/script-tools/index.sh build $(RUN_ARGS)
push:
	@ bash config/script-tools/index.sh push $(RUN_ARGS)
test:
	@ bash config/script-tools/index.sh test $(RUN_ARGS)
now:
	@ # make now -- XXX
	@ # will do now -t token XXXX
	@ bash config/script-tools/index.sh now $(RUN_ARGS)
copy:
	@ bash config/script-tools/index.sh copy $(RUN_ARGS)
merge:
	git fetch __template_remote__ __template_branch__
	git merge remotes/__template_remote__/__template_branch__
rsync:
	cp ./package.json ./production
	gsed -i 's/"start": ".*/"start": "PORT=1345 NODE_ENV=production pm2 start .\/index.js --name headless-chrome:1345",/g' ./production/package.json
	rsync --exclude .tmp --exclude node_modules -cazvF -e "ssh -p 22" ./production/  root@112.74.107.82:/root/production/headless-chrome
docker:
	@ bash config/script-tools/index.sh build development
	docker build -t headless-chrome ./production
	docker image prune -f
	docker images | grep "none" | awk '{print $$3 }' | xargs docker rmi &
	docker ps -qa --filter="name=headless-chrome" | awk '{print $$1 }' | xargs docker stop
	docker ps -qa --filter="name=headless-chrome" | xargs -I {} docker rm -f {}
	docker run --name headless-chrome -d -p 1337:1337 headless-chrome | xargs -I {} docker logs {} -f


ifeq ($(firstword $(MAKECMDGOALS)), $(filter $(firstword $(MAKECMDGOALS)),build push now copy test))
  # use the rest as arguments for "run"
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  # ...and turn them into do-nothing targets
  $(eval $(RUN_ARGS):;@:)
endif