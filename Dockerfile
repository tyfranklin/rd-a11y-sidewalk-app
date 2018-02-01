# Tutorial source: https://semaphoreci.com/community/tutorials/dockerizing-a-java-play-application

FROM ubuntu:16.04

# -------------------
# Setup Ubuntu system
# -------------------
RUN apt-get update
RUN export DEBIAN_FRONTEND=noninteractive 
RUN apt-get -y install software-properties-common

# Install sudo
RUN apt-get install -y sudo && rm -rf /var/lib/apt/lists/*

# Install Java
RUN add-apt-repository ppa:webupd8team/java
RUN apt-get update
RUN echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | sudo /usr/bin/debconf-set-selections
RUN apt-get install -y oracle-java8-installer

# Install archiving tools
RUN apt-get install zip unzip

# Install python
RUN apt-get install -y build-essential checkinstall
RUN apt-get install -y libreadline-gplv2-dev libncursesw5-dev libssl-dev libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev
WORKDIR /usr/src
RUN wget https://www.python.org/ftp/python/2.7.14/Python-2.7.14.tgz && tar xzf Python-2.7.14.tgz
WORKDIR /usr/src/Python-2.7.14
RUN ./configure
RUN make install

# Install other dependencies
RUN apt-get install -yq curl git nano

# -----------------
# Setup Application
# -----------------

# Environment variable for project home
ENV PROJECT_HOME /home/docker

WORKDIR $PROJECT_HOME

# Create project application folder and software library folder
RUN mkdir -p $PROJECT_HOME/envt $PROJECT_HOME/app

# Switch to envt folder to install all the libraries
WORKDIR $PROJECT_HOME/envt
RUN mkdir -p $PROJECT_HOME/envt/npm_install

# Scala
RUN wget https://github.com/sbt/sbt/releases/download/v1.1.0/sbt-1.1.0.zip && unzip sbt-1.1.0.zip

# Activator
RUN wget https://downloads.typesafe.com/typesafe-activator/1.3.12/typesafe-activator-1.3.12.zip && unzip typesafe-activator-1.3.12.zip

# Node JS and NPM
# https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server
RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo bash - && apt-get install -yq nodejs

# Get the latest version
RUN npm install -g npm

# Old Technique
# RUN wget https://nodejs.org/dist/v6.9.1/node-v6.9.1.tar.gz && tar xvf node-v6.9.1.tar.gz
# WORKDIR $PROJECT_HOME/envt/node-v6.9.1
# RUN ./configure --prefix=$PROJECT_HOME/envt/npm_install
# RUN make
# RUN make install

# Add the libraries to the PATH variable
ENV PATH $PROJECT_HOME/envt/activator-dist-1.3.12/bin:$PROJECT_HOME/envt/sbt-1.1.0/bin:$PATH

# Copies all the project git files to the app folder
COPY . $PROJECT_HOME/app

# Install Grunt CLI
RUN npm install -g grunt-cli

# Switch to the app directory
WORKDIR $PROJECT_HOME/app

# Install grunt within the applicaton folder
RUN npm install
RUN grunt

# Expose the port 9000 of the container which will be used by the Play application for communication
EXPOSE 9000

# Deploy the server
# COPY ./docker-entrypoint.sh .
# ENTRYPOINT ["docker-entrypoint.sh"]

