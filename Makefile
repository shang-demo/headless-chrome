.PHONY: all test clean static
d=template2
gulp:
	@ gulp
test:
	@ if [ -n "$(g)" ]; \
	then \
		echo 'mocha --recursive --timeout 10000 --require chai --harmony --bail -g $(g) test'; \
		mocha --recursive --timeout 10000 --require chai --harmony --bail -g $(g) test; \
	else \
		echo 'mocha --recursive --timeout 10000 --require chai --harmony --bail test'; \
		mocha --recursive --timeout 10000 --require chai --harmony --bail test; \
	fi
prod:
	gulp buildServer
	NODE_ENV=production node production/app.js
pushHeroku: 
	gulp buildServer
	cp ./package.json production/
	gsed -i 's/"start": ".*/"start": "NODE_ENV=heroku pm2-docker start .\/remote-index.js --raw",/g' ./production/package.json
	cd production && git add -A && git commit -m "auto" && git push heroku master -f && heroku logs --tail
merge:
	git fetch template v3
	git merge remotes/template/v3
push:
	@ bash config/script-tools/push-git.sh
deploy:
	@ bash config/script-tools/push-git.sh prod $(e)
deploy-now:
	@ bash config/script-tools/deploy-now.sh
alias-now:
	@ bash config/script-tools/alias-now.sh
now:
	@ echo "source config/script-tools/n.sh"
copy:
	@ bash config/script-tools/copy.sh $(d)
rsync:
	cp ./package.json ./production
	gsed -i 's/"start": ".*/"start": "PORT=1345 NODE_ENV=production pm2 start .\/index.js --name headless-chrome:1345",/g' ./production/package.json
	rsync --exclude .tmp --exclude node_modules -cazvF -e "ssh -p 22" ./production/  root@112.74.107.82:/root/production/headless-chrome