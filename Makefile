build-regtest:
	docker build --network=host -t dogecoind provision/

regtest:
	docker run --network=host --name dogecoind_regtest dogecoind
	
restart:
	docker start dogecoind_regtest
	
clean-regtest:
	rm -rf data/paymentchannel