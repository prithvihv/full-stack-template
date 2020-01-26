with import <nixpkgs> {};

stdenv.mkDerivation {
  name = "node_app";
  buildInputs = [
    nodejs-12_x
  ];
  shellHook = ''
    chmod 777  ./node_modules/.bin/*
    export PATH="$PWD/node_modules/.bin/:$PATH"
   '';
}
