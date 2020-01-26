with import <nixpkgs> {};

stdenv.mkDerivation {
  name = "node_app";
  buildInputs = [
    nodejs-12_x
  ];
  shellHook = ''
    export PATH="$PWD/node_modules/.bin/:$PATH"
   '';
}
