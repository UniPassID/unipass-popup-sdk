# $ENV = [main, dev, prerelease]
echo "ENV = ${1}"
if [ -f bin/${1}.env ]; then
  cp bin/${1}.env .env
  vue-cli-service serve --host localhost --port ${2-1900} --open
else
  echo not find bin/${1}.env
fi