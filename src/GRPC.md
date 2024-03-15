# Install protobuf on mac silicon

```bash
npm install -g protoc-gen-js

brew install protobuf@3
brew link --overwrite protobuf@3

wget https://github.com/grpc/grpc-web/releases/download/1.5.0/protoc-gen-grpc-web-1.5.0-darwin-aarch64
sudo mv protoc-gen-grpc-web-1.5.0-darwin-aarch64 /usr/local/bin/protoc-gen-grpc-web
```


# Generate code
```bash
protoc -I=. pair.proto \
    --js_out=import_style=commonjs:. \
    --grpc-web_out=import_style=typescript,mode=grpcwebtext:.
```