#!/usr/bin/env bash

function checkDependencies() {
	_checkDependence gsed
	_checkDependence jq
}

function initProject() {
  local configDir=${projectDir}/${defaultConfigPath}

	local mergeBranch=$(_getConfig "merge.branch" "" ${configDir})
	local mergeUrl=$(_getConfig "merge.url" "" ${configDir})
	local mergeRemote=$(_getConfig "merge.remote" "" ${configDir})

	if [ -z "$1" ]
	then
	  echo "need new project path to set"

    exitAll
  fi

	if [[ $1 = /* ]]
  then
    cpDir=$1
  else
    cpDir="~/$1"
  fi
  projectName=`basename ${cpDir}`

  echo "${cpDir}"

  local checkCover=1
  if [ "0" = "$2" ]
  then
    checkCover=0
  fi

  local isYarn=1
  if [ "0" = "$3" ]
  then
    isYarn=0
  fi

  if [ "${checkCover}" = "1" -a -e ${cpDir} ]
	then
		echo "${cpDir} 目录存在!!";

		exitAll
	fi

	mkdir -p ${cpDir}
	cd ${cpDir}
	git init
	git remote add ${mergeRemote} ${mergeUrl}
	git remote -v
  # 先pull最新代码
	git fetch --depth=1 ${mergeRemote} ${mergeBranch}
  # 后台补全历史记录
	git fetch template v3 --unshallow >/dev/null 2>&1 &
	git checkout -b master remotes/${mergeRemote}/${mergeBranch}

  # change merge branch
	gsed -i "s|__template_remote__|${mergeRemote}|g" Makefile
	gsed -i "s|__template_branch__|${mergeBranch}|g" Makefile
  # change project name and push remote
	cat package.json | jq ".name=\"${projectName}\" | .version=\"0.0.1\"" > __package__.json
	rm package.json
	mv __package__.json package.json

	cat ${defaultConfigPath} | jq "del(.merge) | .dev.url=\"\" | .dev.remote=\"origin\" | .dev.branch=\"\"" > __tmp.json__
	rm ${defaultConfigPath}
	mv __tmp.json__ ${defaultConfigPath}

	rm ${defaultCopyScriptPath}

	echo "# ${projectName}" > README.md
	touch Makefile.rsync.env.private

	git add -A
	git commit -m "init project"

	if [ "${isYarn}" = "1" ]
	then
	  yarnpkg
	fi
}

checkDependencies
initProject $*
