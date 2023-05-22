FROM		timbru31/java-node
RUN			mkdir /my-app
WORKDIR		/my-app
COPY		./build/libs/spellcheck-back-0.0.1-SNAPSHOT.jar app.jar
COPY		./hanspell-0.9.7/* /my-app/
COPY		. .
RUN			npm install
ENTRYPOINT	["java", "-jar", "app.jar"]