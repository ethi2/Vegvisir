// Klasinn E11 notar klasann Link sem er í Link.java.
// Lesið skilgreiningarnar og setningarnar þar.

// The class E11 uses the class Link in file Link.java.
// Read the definitions and theorems there.

public class E11
{    
    // Notkun: splice(x,i,y);
    // Fyrir:  x er lögleg keðja með N>0 hlekki og hlekkjarunu
    //           [x_0,...,x_{N-1}].
    //         0 <= i < N.
    //         y er lögleg keðja með M hlekki og hlekkjarunu
    //           [y_0,...,y_{M-1}].
    //         Keðjurnar x og y hafa engan sameiginlegan hlekk.
    // Eftir:  x er lögleg keðja með N+M hlekki og hlekkjarununa
    //           [x_0,...,x_i,y_0,...,y_{M-1},x_{i+1},...,x_{N-1}].
    //         Takið eftir að y rununni er splæst inn í x rununa
    //         með i+1 hlekki fyrir framan úr gömlu x rununni.
    //         Takið eftir að leyfilegt er að y sé tóm runa.
    //         Takið eftir að engir nýjir hlekkir verða til.
    // Usage:  splice(x,i,y);
    // Pre:    x is a legal chain with N>0 links and a sequence of links
    //           [x_0,...,x_{N-1}].
    //         0 <= i < N.
    //         y is a legal chain with M links and a sequence of links
    //           [y_0,...,y_{M-1}].
    //         The chains x and y have no links in common.
    // Post:   x is a legal chain with N+M links and the sequence of links
    //           [x_0,...,x_i,y_0,...,y_{M-1},x_{i+1},...,x_{N-1}].
    //         Note that the y sequence is spliced into the x sequence
    //         with i+1 links from x in front of the spliced y sequence.
    //         Note that y is allowed to be empty.
    //         Note that no new links are created.
    public static<E> void splice( Link<E> x, int i, Link<E> y )
    {//fyrst i er afritað fyrir fallakallið má breyta i í því
	assert 0<=i;//Það eina sem hægt er með góðu móti að athuga áður en byrjað er
	if(y==null){return;}//Að skeyta inn engu er eins og að skilja eftir óbreytt
	Link<E> yMm1 = y;//Þessi breyta endar með að vera aftasti hlekkur y
	while(yMm1.tail != null)
/*
Fyrst vitað er að allir hlekkir innan löglegrar keðju eru einstakir sbr. lýsingu Link er hægt
að fullyrða að fyrir rest mun .tail verða null og mun þessi lykkja því hætta áður en breytan
sjálf verður null og því mun hún benda á aftasta hlekk í keðju y
*/
	{
		yMm1 = yMm1.tail;
	}
	Link<E> xi = x;//Þessi breyta endar með að vera aftasti hlekkur fyrri hluta x (sem gæti verið aftasti hlekkur x)
	while(i>0)
/*
Ef i er 0 er þessi lykkja aldrei keyrð og xi mun benda á x0
Fyrir hvert auka skref er xi fært aftar og i minnkað
Þar sem (i < N) í byrjun mun lykkjan ekki gera xi að null
Eftir lykkjuna mun i vera 0 og xi benda á aftasta hlekk fyrri hluta keðju x
*/
	{
		xi = xi.tail;
		i--;
	}
	assert i==0;
	Link<E> xfp2 = xi.tail;//xfp2 er fyrsti hlekkur seinni hluta keðju x, gæti verið null
	xi.tail = y;//Skipta yfir á y
	yMm1.tail = xfp2;//yMm1.tail var null fyrir, er mögulega e-ð annað núna
    }
    
    // Notkun: Link<E> x = makeChainLoop(a);
    // Fyrir:  a er E[], ekki null.
    // Eftir:  x er lögleg keðja með N=a.length hlekki og
    //         hlekkjarunu nýrra hlekkja [h_0,...,h_{N-1}] þannig
    //         að h_I.head == a[I] fyrir I=0,...,N-1.
    // Usage:  Link<E> x = makeChainLoop(a);
    // Pre:    a is E[], not null.
    // Post:   x is a legal chain wither N=a.length links and
    //         a sequence [h_0,...,h_{N-1}] of new links such
    //         that h_I.head == a[I] for I=0,...,N-1.
    public static<E> Link<E> makeChainLoop( E[] a )
    {
	assert a != null;
	if(a.length == 0){return null;}//sbr. setningu 1 í skilgreiningu á löglegri keðju
	final Link<E> skil = new Link<E>();//Halda utan um hausinn til að geta skilað keðjunni
	Link<E> labbari = skil;//Þetta er breytan sem "leggur teinana"
	labbari.head = a[0];
	labbari.tail = null;//Vegna aðstæðna þarf að gera fyrsta skref utan lykkjunnar sem á leiðinni er.
	for(int i=1;i<a.length;i++)//teljarinn byrjar á 1 því búið er að sjá um fyrsta skref
/*
Ef a.length er 1 er lykkjunni sleppt og búið er að sjá um fyrsta skref
Meðan innihald lykkjunnar er keyrt mun i ganga frá 1 upp í (a.length-1)
Hvert af þeim skrefum sér um viðeigandi hlekk: h_1 þegar i er 1, upp í h_{N-1} þegar i er (a.length-1)
*/
	{
		labbari.tail = new Link<E>();
		labbari = labbari.tail;
		labbari.head = a[i];
		labbari.tail = null;
	}
	return skil;
    }
    
    // Notkun: Link<E> x = makeChainRecursive(a,i,j);
    // Fyrir:  a er E[], ekki null, og a[i..j) er svæði í a.
    //         (Athugið að þá er 0 <= i <= j <= a.length).
    // Eftir:  x er lögleg keðja með N=j-i hlekki og
    //         hlekkjarunu nýrra hlekkja [h_0,...,h_{N-1}] þannig
    //         að h_I.head == a[I-i] fyrir I=0,...,N-1.
    // Usage:  Link<E> x = makeChainRecursive(a,i,j);
    // Pre:    a is E[], not null, and a[i..j) is a section of a.
    //         (Note that we have 0 <= i <= j <= a.length).
    // Post:   x is a legal chain with N=j-i links and a sequence
    //         of new links [h_0,...,h_{N-1}] such that
    //         h_I.head == a[I-i] for I=0,...,N-1.
    public static<E> Link<E> makeChainRecursive( E[] a, int i, int j )
    {
	assert a != null;
	assert 0<=i;
	assert i<=j;
	assert j<=a.length;
	if(i==j){return null;}//ekkert eftir
	//i<j þegar hingað er komið
	Link<E> skil = new Link<E>();
	skil.head = a[i];
/*
Aðeins tail er búið til endurkvæmt. Ef það er lögleg keðja
er þetta líka lögleg keðja sbr. setningu 2 í skilgreiningu á löglegri keðju.
a og j eru óbreytt því þau halda utan um skriffinskuna.
i vex án efa og mun jafna j fyrir rest og þá er ekki kallað aftur á þetta fall.
*/
	skil.tail = makeChainRecursive(a,i+1,j);
	return skil;
    }
    
    // Prófið að keyra þessa skipun:
    //  java E11 1 2 3 4 5 6
    // það ætti að skrifa
    //  1 2 3 4 1 2 3 4 5 6 5 6
    // Try running this command:
    //  java E11 1 2 3 4 5 6
    // this should write
    //  1 2 3 4 1 2 3 4 5 6 5 6
    public static void main( String[] args )
    {
        Link<String> x = makeChainLoop(args);
        Link<String> y = makeChainRecursive(args,0,args.length);
        splice(x,3,y);
        splice(x,0,null);
        while( x != null )
        {
            System.out.print(x.head+" ");
            x = x.tail;
        }
    }
}