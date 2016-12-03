#!/bin/bash
elm-package install
npm install --save elm-webpack-loader elm-hot-loader
npm install --save-dev clean-webpack-plugin copy-webpack-plugin
