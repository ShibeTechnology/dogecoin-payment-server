build-regtest:
	docker build --network=host -t dogecoind provision/dogecoind/

regtest:
	docker run --network=host -p 18444:18444 --name dogecoind_regtest dogecoind
	
restart:
	docker start dogecoind_regtest
	
clean-regtest:
	rm -rf data/regtest