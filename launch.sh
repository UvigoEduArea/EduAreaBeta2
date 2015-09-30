#!/bin/bash

lanzaFaye()
{
	rackup faye.ru -E production -s thin &
}

lanzarails()
{
	echo "------------ Lanzando servidor Thin ------------"
	rails server thin
	#echo "con"
}

texto()
{
	echo "***************************************"
	echo "***************************************"
	echo "*** "$1
	echo "***************************************"
	echo "***************************************"
}

lanzaFaye
lanzarails
texto "HAVE A NICE DAY, POLLUELOS!"




