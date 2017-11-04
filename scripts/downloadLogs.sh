#!/bin/bash

# SmartCloud Integration Server FTPS login parameters
HOST="ftp.ce.collabserv.com"
PORT="990"
USER="enter_username_for_your_journaling_account"
PASSWORD="enter_password"
DIR="journal"

# enter directory where log files are stored
cd logs

# Backup: all parameters for curl
# curl -l -1 -v --disable-epsv --ftp-skip-pasv-ip -u $USER:$PASSWORD ftps://$HOST:$PORT/$DIR/

# 1. get listing of journal/ directory
# 2. go through the listing and download each file
for f in $(curl -l -1 -sS --disable-epsv --ftp-skip-pasv-ip -u $USER:$PASSWORD ftps://$HOST:$PORT/$DIR/) ; do
		curl -1 -sS --disable-epsv --ftp-skip-pasv-ip -u $USER:$PASSWORD ftps://$HOST:$PORT/$DIR/$f -O;
	done

gunzip -f *.gz

# go back to original directory
cd ..
