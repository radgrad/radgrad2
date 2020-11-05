#!/bin/bash

# Run from your project's root
# Run "npm install" or "npm update" before
# Requirement: ~/Desktop/jq-osx-amd64 (https://stedolan.github.io/~/Desktop/jq-osx-amd64/)

required () {
	grep -R "from ['\"]${1}[\\/'\"]\|require(['\"]${1}[\\/'\"]" --exclude-dir=node_modules --include='*.js' > /dev/null
}

used_in_script () {
	# Use a temp file as "while … done" executes in a subprocess and any return or
	# local variable in there won't be passed to function's scope
	local tmp=$(mktemp)
	echo 1 > $tmp
	if ~/Desktop/jq-osx-amd64 -e 'has("scripts")' package.json > /dev/null; then
		# There are npm scripts, look into them (note: here we won't recursively parse referenced scripts)
		if ~/Desktop/jq-osx-amd64 -e 'has("bin")' "node_modules/$1/package.json" > /dev/null; then
			# dep has bins, check for them
			~/Desktop/jq-osx-amd64 -r '.bin|keys|join("\n")' "node_modules/$1/package.json" | while read b; do
				if ~/Desktop/jq-osx-amd64 -r '.scripts|values|join("\n")' package.json | grep "\(^\|['\" ]\)$b\($\|['\" ]\)" > /dev/null; then
					echo 0 > $tmp
				fi
			done
		fi
		# All cases: check for direct reference (used as a plugin)
		if ~/Desktop/jq-osx-amd64 -r '.scripts|values|join("\n")' package.json | grep "\(['\" =]\)${1}\($\|['\" ]\)" > /dev/null; then
			echo 0 > $tmp
		fi
	fi
	local status=$(cat $tmp)
	rm -f $tmp
	return $status
}

check_used () {
	local tmp=$(mktemp)
	echo 0 > $tmp
	~/Desktop/jq-osx-amd64 -r ".${1}|keys|join(\"\\n\")" package.json | while read p; do
		echo -e -n "\033[0m$p… "
		if required $p; then
			echo -e "\033[1K\033[0;32m\r$p used (required)."
		elif used_in_script $p; then
			echo -e "\033[1K\033[0;32m\r$p used (npm script)."
		else
			echo -e "\033[1K\033[1;31m\r$p unused?"
			echo 1 > $tmp
		fi
	done
	local status=$(cat $tmp)
	rm -f $tmp
	return $status
}

check_used_all () {
	local res=0

	echo -e "\033[;1m\nChecking dependencies…\n"
	if check_used "dependencies"; then
		echo -e "\033[1;32m\nEverything looks OK :)"
	else
		res=1
		echo -e "\033[1;31m\nSome packages looks like not being used (but I may have not detected them)"
		echo -e "\033[0mTo remove a package: npm remove --save <package>"
	fi

	echo -e "\033[;1m\nChecking devDependencies…\n"
	if check_used "devDependencies"; then
		echo -e "\033[1;32m\nEverything looks OK :)"
	else
		res=1
		echo -e "\033[1;31m\nSome packages looks like not being used (but I may have not detected them)"
		echo -e "\033[0mTo remove a package: npm remove --save-dev <package>"
	fi

	return $res
}

if check_used_all; then
	echo -e "\033[1;32m\nALL OK."
	exit 0
else
	echo -e "\033[1;31m\nCheck your dependencies…"
	exit 1
fi