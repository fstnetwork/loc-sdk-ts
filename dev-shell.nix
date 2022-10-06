{ pkgs ? import <nixpkgs> }:

pkgs.mkShell rec {
  name = "dev-shell";

  buildInputs = with pkgs; [
    nix-update
    nixpkgs-fmt
    yarn2nix
  ];

  shellHook = ''
    export NIX_PATH="nixpkgs=${pkgs.path}"
  '';
}
