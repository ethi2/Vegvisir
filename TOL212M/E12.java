// Höfundur/Author: Snorri Agnarsson, snorri@hi.is

// Notið Link.java, sem er í Canvas, sem hjálparklasa.

// Í eftirfarandi umfjöllun eru allar keðjur endanlegar
// og löglegar eins og lýst er í Link.java

// Vistið þessa skrá undir nafninu E12.java og gerið
// viðeigandi viðbætur þar sem þið finnið ???

// Use Link.java, which is in Canvas, as a helper class.

// In the following discussion all chains are finite
// and legal as described in Link.java.

// Store this file under the name E12.java and make
// the appropriate additions where you find ???

public class E12
{
    // Notkun: removeMinLink(chain,res);
    // Fyrir:  chain er ekki-tóm keðja.
    //         res er tveggja staka Link<T>[], þ.e. res.length == 2.
    // Eftir:  res[0] vísar á þann hlekk innan gamla chain sem
    //         inniheldur minnsta gildið.
    //         res[1] vísar á keðju hinna hlekkjanna sem voru í
    //         gamla chain, í einhverri óskilgreindri röð.
    //         Allir hlekkir í gamla chain eru annað hvort í keðjunni
    //         res[1] eða eru hlekkurinn sem res[0] vísar á.
    //         Ekki þarf að taka fram (í Java) að öll gildi (head) í
    //         hlekkjunum eru óbreytt, aðeins halarnir (tail) hafa
    //         hugsanlega breyst.
    //         Ekki má úthluta neinum nýjum hlekkjum.
    // Ath.:   Búa má til fylki res með eftirfarandi Java skipun:
    //           Link<T>[] res = (Link<T>[])new Link<?>[2];
    //         Þið fáið þá aðvörun frá Java, en það er í lagi.
    // Usage:  removeMinLink(chain,res);
    // Pre:    chain is a non-empty chain.
    //         res is a two element Link<T>[], i.e. res.length == 2.
    // Post:   res[0] refers to the link in the original chain which
    //         contains the smallest value.
    //         res[1] refers to a chain containing all the other links
    //         which were in chain in some unspecified order.
    //         All the links that originally were in chain are either
    //         in the chain res[1] or are the link that res[0] refers
    //         to. All the values (heads) in the links are unchanged,
    //         only the tails hae changed. No new links have been
    //         allocated.
    // Note:   The array res can be allocated using the following statement:
    //           Link<T>[] res = (Link<T>[])new Link<?>[2];
    //         You will get a warning from Java, but that is normal.
    public static<T extends Comparable<? super T>>
    void removeMinLink( Link<T> chain, Link<T>[] res )
    {
	assert chain != null;
	assert res.length == 2;
        // Hér vantar forritstexta.
        // Útfærið þetta með lykkju þar sem fastayrðingin skal
        // vera keimlík þeirri fastayrðingu sem notuð var í
        // lausninni á MinOfMultiset sem við leystum áður í
        // Dafny.  Aðalatriðið hér er að fastayrðingin
        // lykkjunnar sé góð. Ekki fást mörg stig fyrir lausn
        // sem ekki hefur góða fastayrðingu jafnvel þótt
        // fallið virki samkvæmt lýsingu.
        // Here we need program text.
        // Implement this with a loop where the loop invariant
        // will be similar to the one in the Dafny method
        // MinOfMultiset that we implemented earlier. The
        // most important thing here is that the loop
        // invariant is good. You do not get many point for
        // a solution that does not have a good loop invariant
        // even if the solution works as described.

	/*
	Ef ekki má úthluta nýjum hlekkjum verður að breyta keðjunni sem chain byrjar
	til að tengja framhjá minnsta gildi; res[1] verður eins og chain
	*/
	T mingildi = chain.head;
	Link<T> labbari = chain.tail;
	res[0] = chain;
	res[1] = chain;
	while(labbari != null)
	/*
	Gengið er eftir keðjunni út á enda og hausgildið borið saman við minnsta fundið gildi.
	res[0] er notað beint sem hlekkbendir á þann hlekk sem minnst gildi hefur
	Við byrjun og enda hverrar ýtranar bendir breytan labbari á þann hlekk sem á að sjá um næst
	eða null ef búið er að sjá um allt.
	Búið er að sjá um allt sem er í chain en ekki í labbari, og res[0] er einn af þeim hlekkjum.
	Breytan mingildi er minnsta gildi sem fundist hefur hingað til, og res[0] bendir á þann hlekk.
	*/
	{
		if(labbari.head.compareTo(mingildi) < 0)//Þýðir að hausinn er minni
		{
			mingildi = labbari.head;
			res[0] = labbari;
		}
		labbari = labbari.tail;
	}

	/*
	Nú þarf að fara aðra ferð til að tengja fram hjá,
	en fyrst athuga hvort fremsta gildi sé það minnsta
	*/
	if(res[0] == res[1])
	{//Þetta gerist aðeins ef minnsta gildið var fremst í keðjunni
		res[1] = res[1].tail;//ef keðjan hafði bara 1 hlekk mun þetta gera res[1] að null
	}
	else
	{//minnsta gildið var ekki fremst
		labbari = chain;
		while(labbari.tail != res[0])
		/*
		Vitað er að res[0] er í chain og bendir á næsta hlekk þar sem engum hala hefur verið breytt enn.
		Þessi lykkja mun því stoppa þegar labbari bendir á hlekkinn fyrir framan res[0]
		*/
		{
			labbari = labbari.tail;
		}

		labbari.tail = res[0].tail;//tengja fram hjá; eina breyting á tail-breytu í þessu falli
	}
    }

    // Notkun: Link<T> y = selectionSort(x);
    // Fyrir:  x er lögleg keðja þar sem hlekkirnir innihalda
    //         lögleg gildi af tagi T.
    // Eftir:  y er keðja sömu hlekkja þannig að hlekkirnir
    //         í y eru í vaxandi hausaröð miðað við compareTo
    //         fyrir hluti af tagi T.
    // Usage:  Link<T> y = selectionSort(x);
    // Pre:    x is a legal chain where the links contain legal
    //         objects of type T.
    // Post:   y is a chain of the same links such that the links
    //         are in ascending order of the head values as defined
    //         by compareTo for objects of type T.
    public static<T extends Comparable<? super T>>
    Link<T> selectionSort( Link<T> x )
    {
        // Hér vantar forritstexta.
        // Útfærið þetta með lykkju þar sem fastayrðingin skal
        // vera keimlík þeirri fastayrðingu sem notuð var í
        // lausninni á Sort í E3.dfy sem við leystum áður í
        // Dafny.  Aðalatriðið hér er að fastayrðingin
        // lykkjunnar sé góð. Ekki fást mörg stig fyrir lausn
        // sem ekki hefur góða fastayrðingu jafnvel þótt
        // fallið virki samkvæmt lýsingu.
        // Here we need program text.
        // Implement this with a loop where the loop invariant
        // will be similar to the one in the Dafny method
        // Sort in E3.dfy that we implemented earlier. The
        // most important thing here is that the loop
        // invariant is good. You do not get many point for
        // a solution that does not have a good loop invariant
        // even if the solution works as described.
	if(x==null){return null;}
	Link<T>[] res = (Link<T>[])new Link<?>[2];
	removeMinLink(x,res);//Ef hlekkjaruna x hafði lengdina 1 gerir þetta res[1] að null
	Link<T> skil = res[0];//Þetta verður skilagildi selectionSort
	Link<T> bob = res[0];//Þessi breyta sér um að tengja rétt
	/*
	Ef res[1] er null hér þýðir það að hlekkjaruna x hefur lengdina 1,
	því er res[0] eini hlekkurinn og með halann null og er því röðuð keðja,
	og því má skila beint. Lykkjan hér að neðan verður aldrei keyrð ef svo er.
	*/
	while(res[1] != null)
	/*
	res[1] er "afgangurinn", þ.e. það sem á eftir að raða; allt þar er stærra en það sem er í skil til og með bob.
	Hægt er að nota res[1] sem inntak eftir að búið er að sjá um res[0]
	Eftir hvert kall á removeMinLink(res[1],res) er res[0] minnst miðað við það sem er í res[1], en stæst miðað við það sem er í skil til og með bob
	bob er fært "áfram" í hverri ýtrun og eykur bilið milli skil og bob.
	það sem var fjarlægt úr "afganginum" er það sem er bætt við keðjuna skil
	(fyrir rest verður res[1] að null sem þýðir að res[0].tail er null sem gerir bob að null sem gerir skil að réttri keðju)
	*/
	{
		removeMinLink(res[1],res);
		bob.tail = res[0];
		bob = bob.tail;
	}
	return skil;
    }
    
    // Notkun: Link<T> z = insert(x,y);
    // Fyrir:  x er keðja í vaxandi röð (má vera tóm).
    //         y vísar á hlekk (má ekki vera null).
    // Eftir:  z er keðja í vaxandi röð sem inniheldur
    //         alla hlekkina úr x auk hlekksins y.
    //         Athugið að ekki má úthluta neinum nýjum
    //         hlekkjum.
    // Usage:  Link<T> z = insert(x,y);
    // Pre:    x is a chain in ascending order (may be empty).
    //         y refers to a link (must not be null).
    // Post:   z is a chain in ascending order that contains
    //         all the links from x and also the link y.
    //         No new links must be allocated.
    public static<T extends Comparable<? super T>>
    Link<T> insert( Link<T> x, Link<T> y )
    {
	assert y != null;
	// Hér vantar forritstexta.
	// Here we need program text.
	if((x == null) || (x.head.compareTo(y.head) >= 0))//short-circuiting gerist hér
	{//y á heima fremst; síðan kemur allt x, eða null ef x er null (því y gæti hafa verið tengt e-t óviðkomandi)
		y.tail = x;
		return y;
	}
	//Vitað er hér að y fer ekki fremst
	Link<T> safestep = x;
	Link<T> checkstep = x.tail;
	while((checkstep != null) && (checkstep.head.compareTo(y.head)<0))//short-circuiting gerist hér
	/*
	checkstep er alltaf jafnt safestep.tail
	safestep og checkstep haldast í hendur og ferðast eftir x þangað til endanum er náð eða checkstep er ekki lengur minna en y
	Á þeim tímapunkti á y heima milli safestep og checkstep.
	safestep verður því alltaf minna en y og hægt er að tengja þessa 3 hnúta rétt.
	*/
	{
		safestep = checkstep;
		checkstep = safestep.tail;
	}
	safestep.tail = y;
	y.tail = checkstep;
	return x;
    }

    
    // Notkun: Link<T> y = insertionSort(x);
    // Fyrir:  x er lögleg keðja þar sem hlekkirnir innihalda
    //         lögleg gildi af tagi T.
    // Eftir:  y er keðja sömu hlekkja þannig að hlekkirnir
    //         í y eru í vaxandi hausaröð miðað við compareTo
    //         fyrir hluti af tagi T.
    // Usage:  Link<T> y = insertionSort(x);
    // Pre:    x is a legal chain where the links contain legal
    //         objects of type T.
    // Post:   y is a chain of the same links such that the links
    //         are in ascending order of the head values as defined
    //         by compareTo for objects of type T.
    public static<T extends Comparable<? super T>>
    Link<T> insertionSort( Link<T> x )
    {
        // Hér vantar forritstexta.
        // Here we need program text.
	Link<T> newconstruction = null, remainder = x;
	while(remainder != null)
	/*
	Ef x byrjar sem null er þessi lykkja aldrei keyrð og skilað verður null.
	Í hverju skrefi er fremsti hnútur x tekinn og settur inn í newconstruction með insert()
	insert() sér um tengingarnar
	x er fært "áfram", svo hlekkjaruna x minnkar, í hverju skrefi.
	keðjan newconstruction er í vaxandi hausaröð í hverju skrefi, vitað því henni er aðeins breytt af insert()
	x og remainder eru eins nema í það augnablik þegar kalla þarf á insert()
	x og remainder verða á endanum null því x er ekki tengt í hring
	*/
	{
		remainder = x.tail;
		newconstruction = insert(newconstruction,x);
		x = remainder;
	}
	return newconstruction;
    }
    
    // Notkun: Link<T> x = makeChain(a,i,j);
    // Fyrir:  a er T[], ekki null.
    //         0 <= i <= j <= a.length.
    // Eftir:  x vísar á keðju nýrra hlekkja sem innihalda
    //         gildin a[i..j), í þeirri röð, sem hausa.
    // Usage:  Link<T> x = makeChain(a,i,j);
    // Pre:    a is a T[], not null.
    //         0 <= i <= j <= a.length.
    // Post:   x refers to a chain of new links that contain
    //         the values a[i..j), in that order, as heads.
    public static<T> Link<T> makeChain( T[] a, int i, int j )
    {
        if( i==j ) return null;
        Link<T> x = new Link<T>();
        x.head = a[i];
        x.tail = makeChain(a,i+1,j);
        return x;
    }
    
    // Keyrið skipanirnar
    //   javac E12.java
    //   java E12 1 2 3 4 3 2 1 10 30 20
    // og sýnið útkomuna í athugasemd hér:
    // Run the commands
    //   javac E12.java
    //   java E12 1 2 3 4 3 2 1 10 30 20
    // and show the results as a comment here:
        /*
1 1 10 2 2 20 3 3 30 4
1 1 10 2 2 20 3 3 30 4
	*/
    public static void main( String[] args )
    {
        Link<String> x = makeChain(args,0,args.length);
        x = selectionSort(x);
        while( x != null )
        {
            System.out.print(x.head+" ");
            x = x.tail;
        }
        System.out.println();
        x = makeChain(args,0,args.length);
        x = insertionSort(x);
        while( x != null )
        {
            System.out.print(x.head+" ");
            x = x.tail;
        }
    }
}