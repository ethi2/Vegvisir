// Klasinn E11 notar klasann Link sem er � Link.java.
// Lesi� skilgreiningarnar og setningarnar �ar.

// The class E11 uses the class Link in file Link.java.
// Read the definitions and theorems there.

public class E11
{    
    // Notkun: splice(x,i,y);
    // Fyrir:  x er l�gleg ke�ja me� N>0 hlekki og hlekkjarunu
    //           [x_0,...,x_{N-1}].
    //         0 <= i < N.
    //         y er l�gleg ke�ja me� M hlekki og hlekkjarunu
    //           [y_0,...,y_{M-1}].
    //         Ke�jurnar x og y hafa engan sameiginlegan hlekk.
    // Eftir:  x er l�gleg ke�ja me� N+M hlekki og hlekkjarununa
    //           [x_0,...,x_i,y_0,...,y_{M-1},x_{i+1},...,x_{N-1}].
    //         Taki� eftir a� y rununni er spl�st inn � x rununa
    //         me� i+1 hlekki fyrir framan �r g�mlu x rununni.
    //         Taki� eftir a� leyfilegt er a� y s� t�m runa.
    //         Taki� eftir a� engir n�jir hlekkir ver�a til.
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
    {//fyrst i er afrita� fyrir fallakalli� m� breyta i � �v�
	assert 0<=i;//�a� eina sem h�gt er me� g��u m�ti a� athuga ��ur en byrja� er
	if(y==null){return;}//A� skeyta inn engu er eins og a� skilja eftir �breytt
	Link<E> yMm1 = y;//�essi breyta endar me� a� vera aftasti hlekkur y
	while(yMm1.tail != null)
/*
Fyrst vita� er a� allir hlekkir innan l�glegrar ke�ju eru einstakir sbr. l�singu Link er h�gt
a� fullyr�a a� fyrir rest mun .tail ver�a null og mun �essi lykkja �v� h�tta ��ur en breytan
sj�lf ver�ur null og �v� mun h�n benda � aftasta hlekk � ke�ju y
*/
	{
		yMm1 = yMm1.tail;
	}
	Link<E> xi = x;//�essi breyta endar me� a� vera aftasti hlekkur fyrri hluta x (sem g�ti veri� aftasti hlekkur x)
	while(i>0)
/*
Ef i er 0 er �essi lykkja aldrei keyr� og xi mun benda � x0
Fyrir hvert auka skref er xi f�rt aftar og i minnka�
�ar sem (i < N) � byrjun mun lykkjan ekki gera xi a� null
Eftir lykkjuna mun i vera 0 og xi benda � aftasta hlekk fyrri hluta ke�ju x
*/
	{
		xi = xi.tail;
		i--;
	}
	assert i==0;
	Link<E> xfp2 = xi.tail;//xfp2 er fyrsti hlekkur seinni hluta ke�ju x, g�ti veri� null
	xi.tail = y;//Skipta yfir � y
	yMm1.tail = xfp2;//yMm1.tail var null fyrir, er m�gulega e-� anna� n�na
    }
    
    // Notkun: Link<E> x = makeChainLoop(a);
    // Fyrir:  a er E[], ekki null.
    // Eftir:  x er l�gleg ke�ja me� N=a.length hlekki og
    //         hlekkjarunu n�rra hlekkja [h_0,...,h_{N-1}] �annig
    //         a� h_I.head == a[I] fyrir I=0,...,N-1.
    // Usage:  Link<E> x = makeChainLoop(a);
    // Pre:    a is E[], not null.
    // Post:   x is a legal chain wither N=a.length links and
    //         a sequence [h_0,...,h_{N-1}] of new links such
    //         that h_I.head == a[I] for I=0,...,N-1.
    public static<E> Link<E> makeChainLoop( E[] a )
    {
	assert a != null;
	if(a.length == 0){return null;}//sbr. setningu 1 � skilgreiningu � l�glegri ke�ju
	final Link<E> skil = new Link<E>();//Halda utan um hausinn til a� geta skila� ke�junni
	Link<E> labbari = skil;//�etta er breytan sem "leggur teinana"
	labbari.head = a[0];
	labbari.tail = null;//Vegna a�st��na �arf a� gera fyrsta skref utan lykkjunnar sem � lei�inni er.
	for(int i=1;i<a.length;i++)//teljarinn byrjar � 1 �v� b�i� er a� sj� um fyrsta skref
/*
Ef a.length er 1 er lykkjunni sleppt og b�i� er a� sj� um fyrsta skref
Me�an innihald lykkjunnar er keyrt mun i ganga fr� 1 upp � (a.length-1)
Hvert af �eim skrefum s�r um vi�eigandi hlekk: h_1 �egar i er 1, upp � h_{N-1} �egar i er (a.length-1)
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
    // Fyrir:  a er E[], ekki null, og a[i..j) er sv��i � a.
    //         (Athugi� a� �� er 0 <= i <= j <= a.length).
    // Eftir:  x er l�gleg ke�ja me� N=j-i hlekki og
    //         hlekkjarunu n�rra hlekkja [h_0,...,h_{N-1}] �annig
    //         a� h_I.head == a[I-i] fyrir I=0,...,N-1.
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
	//i<j �egar hinga� er komi�
	Link<E> skil = new Link<E>();
	skil.head = a[i];
/*
A�eins tail er b�i� til endurkv�mt. Ef �a� er l�gleg ke�ja
er �etta l�ka l�gleg ke�ja sbr. setningu 2 � skilgreiningu � l�glegri ke�ju.
a og j eru �breytt �v� �au halda utan um skriffinskuna.
i vex �n efa og mun jafna j fyrir rest og �� er ekki kalla� aftur � �etta fall.
*/
	skil.tail = makeChainRecursive(a,i+1,j);
	return skil;
    }
    
    // Pr�fi� a� keyra �essa skipun:
    //  java E11 1 2 3 4 5 6
    // �a� �tti a� skrifa
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