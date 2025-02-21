// Visti� �essa skr� me� nafninu E6.java og kl�ri� a�
// forrita f�llin searchRecursive, searchLoop og
// searchTailRecursive.  �i� skulu� l�ka ���a og keyra
// klasann svona (�i� �urfi� einnig skr�na AVL.java):
//	javac AVL.java E6.java
//	java E6
// � forrituninni skulu� �i� fylgja �eim st��ul�singum
// sem gefnar eru.

// Save this file with the name E6.java and finish
// programming the functions searchRecursive, searchLoop,
// and searchTailRecursive.  You should also compile and
// run the class like this (you also need the file AVL.java):
//	javac AVL.java E6.java
//	java E6
// In the programming you should fulfil the state descriptions
// given.

class E6
{
	public static class Pair<T extends Comparable<? super T>>
	{
		public AVL<T> le,gt;
	}

	// Notkun: searchRecursive(t,x,p);
	// Fyrir:  t er AVL<T> tr�, x er T gildi, p er Pair<T>.
	//	Ekkert �essara gilda (nema e.t.v. t) er null og t er � vaxandi
	//	r��.
	// Eftir:  p.le v�sar � aftasta hn�t � t me� gildi <=x,
	//	ef sl�kur hn�tur er til. Ef sl�kur hn�tur er
	//	ekki til �� er p.le jafnt null.
	//	p.gt v�sar � fremsta hn�t � t me� gildi >x,
	//	ef sl�kur hn�tur er til. Ef sl�kur hn�tur er
	//	ekki til �� er p.gt jafnt null.

	// Usage:  searchRecursive(t,x,p);
	// Pre:	t is an AVL<T> tree, x is a T value, p is a Pair<T>.
	//	None of those values (except maybe t) are null and t is in ascending
	//	order.
	// Post:   p.le refers to the rightmost node in t with a value
	//	<=x, if such a node exists. If no such node exists
	//	then p.le is null.
	//	p.gt refers to the leftmost node in t with a value
	//	>x, if such a node exists. If no such node exists
	//	then p.gt is null.
	public static<T extends Comparable<? super T>> void searchRecursive( AVL<T> t, T x, Pair<T> p )
	{
		if( t == null )
		{
			if(p.le!=null && AVL.rootValue(p.le).compareTo(x) <= 0)
			{}//allt � g�dd�
			else
			{p.le = null;}

			if(p.gt!=null && AVL.rootValue(p.gt).compareTo(x) > 0)
			{}//allt � g�dd�
			else
			{p.gt = null;}

			return;
		}
		else if( AVL.rootValue(t).compareTo(x) <= 0 )
		{//hn�tagildi� er <= leitargildi�
			//... h�r vantar forritstexta -- missing code here
			/*
			Var�andi p.le:
				p.le �tti a� vera alla vega �etta aftarlega.
				�a� g�ti veri� hn�tur h�gra megin sem uppfyllir l�ka skilyr�i�.
			Var�andi p.gt:
				M�gulega var fari� of langt. Ekki uppf�ra p.gt h�r, en ef h�gra barn er st�rri en leitargildi� er �a� fremsti sl�ki hn�tur. (So far)
				Ef �etta er fyrsta fallakall er allt til vinstri ��arfi, svo leita bara til h�gri.
			*/
			p.le = t;
			searchRecursive(AVL.right(t),x,p);//p.le bara uppf�rt ef sl�kur hn�tur finnst
		}
		else
		{//hn�tagildi� er > leitargildi�
			//... h�r vantar forritstexta -- missing code here
			/*
			Var�andi p.le:
				E.t.v. var fari� of langt. Ekki uppf�ra p.le h�r, en ef gildi� finnst � vinstra barni er �a� aftasti sl�ki hn�tur. (So far)
				Ef �etta er fyrsta skipti sem kalla� er � falli� mun �a� ekki finnast � h�gra barni, svo leita bara � vinstra.
			Var�andi p.gt:
				g.gt �tti a� vera alla vega �etta framarlega.
				M�gulega mun enn fremri hn�tur l�ka uppfylla skilyr�in.
			*/
			p.gt = t;
			searchRecursive(AVL.left(t),x,p);
		}
	}

	// Notkun: searchTailRecursive(t,x,p);
	// Fyrir:  t er AVL<T> tr�, x er T gildi, p er Pair<T>.
	//	Ekkert �essara gilda er null (nema e.t.v. t) og t er � vaxandi
	//	r��.
	// Eftir:  p.le v�sar � aftasta hn�t � t me� gildi <=x,
	//	ef sl�kur hn�tur er til. Ef sl�kur hn�tur er
	//	ekki til �� er p.le �breytt.
	//	p.gt v�sar � fremsta hn�t � t me� gildi >x,
	//	ef sl�kur hn�tur er til. Ef sl�kur hn�tur er
	//	ekki til �� er p.gt �breytt.

	// Usage:  searchTailRecursive(t,x,p);
	// Pre:	t is an AVL<T> tree, x is a T value, p is a Pair<T>.
	//	None of those values (except maybe t) are null and t is in ascending
	//	order.
	// Post:   p.le refers to the rightmost node in t with a value
	//	<=x, if such a node exists. If no such node exists
	//	then p.le is unchanged.
	//	p.gt refers to the leftmost node in t with a value
	//	>x, if such a node exists. If no such node exists
	//	then p.gt is unchanged.
	public static<T extends Comparable<? super T>> void searchTailRecursive( AVL<T> t, T x, Pair<T> p )
	{
		if( t == null ) return;
		if( AVL.rootValue(t).compareTo(x) <= 0 )
		{
			//... h�r vantar forritstexta -- missing code here
			p.le = t;
			searchTailRecursive(AVL.right(t),x,p);
		}
		else
		{
			p.gt = t;
			searchTailRecursive(AVL.left(t),x,p);
		}
	}

	// Notkun: searchLoop(t,x,p);
	// Fyrir:  t er AVL<T> tr�, x er T gildi, p er Pair<T>.
	//	Ekkert �essara gilda (nema e.t.v. t) er null og t er � vaxandi
	//	r��.
	// Eftir:  p.le v�sar � aftasta hn�t � t me� gildi <=x,
	//	ef sl�kur hn�tur er til. Ef sl�kur hn�tur er
	//	ekki til �� er p.le jafnt null.
	//	p.gt v�sar � fremsta hn�t � t me� gildi >x,
	//	ef sl�kur hn�tur er til. Ef sl�kur hn�tur er
	//	ekki til �� er p.gt jafnt null.

	// Usage:  searchLoop(t,x,p);
	// Pre:	t is an AVL<T> tree, x is a T value, p is a Pair<T>.
	//	None of those values (except maybe t) are null and t is in ascending
	//	order.
	// Post:   p.le refers to the rightmost node in t with a value
	//	<=x, if such a node exists. If no such node exists
	//	then p.le is null.
	//	p.gt refers to the leftmost node in t with a value
	//	>x, if such a node exists. If no such node exists
	//	then p.gt is null.
	public static<T extends Comparable<? super T>> void searchLoop( AVL<T> t, T x, Pair<T> p )
	{
		AVL<T> s = t;
		//... h�r vantar forritstexta -- missing code here
		p.le = null;
		p.gt = null;
		while( s != null )
		{
			// s er undirtr� t me� einhverja trj�sl�� sp.
			// Allt � PreSeq(t,sp) er <=x.
			// Allt � PostSeq(t,sp) er >x.
			// Ef til er hn�tur � t fyrir framan s undirtr��
			// (�.e. PreSeq(t,sp) er ekki t�mt) �� v�sar
			// p.le � aftasta sl�kan hn�t.  Annars er p.le
			// jafnt null.
			// Ef til er hn�tur � t fyrir aftan s undirtr��
			// (�.e. PostSeq(t,sp) er ekki t�mt) �� v�sar
			// p.gt � fremsta sl�kan hn�t.  Annars er p.gt
			// jafnt null.

			// s is a subtree of t with some treepath sp.
			// All in PreSeq(t,sp) is <=x.
			// All � PostSeq(t,sp) is >x.
			// If there exists a node in t to the left of the
			// s subtree (i.e. PreSeq(t,sp) is not empty) then
			// p.le refers to the rightmost such node. Otherwise
			// p.le is null.
			// If there exists a node in t to the right of the
			// s subtree (i.e. PostSeq(t,sp) is not empty) then
			// p.gt refers to the leftmost such node. Otherwise
			// p.gt is null.

			//... h�r vantar forritstexta -- missing code here
			if( AVL.rootValue(s).compareTo(x) <= 0 )
			{
				p.le = s;
				s = AVL.right(s);
			}
			else
			{
				p.gt = s;
				s = AVL.left(s);
			}
		}
	}

	private static void test_LastLE_FirstGT
		( java.util.function.Function<Integer,Pair<Integer>> f
		, AVL<Integer> t
		)
	{
		for( int x=-1 ; x!=2000 ; x++ )
		{
			Pair<Integer> p = f.apply(x);
			if( p.le != null )
			{
				if( AVL.rootValue(p.le) > x )
					throw new Error(""+x);
				if( x >= 1998 && AVL.rootValue(p.le) != 1998 )
					throw new Error(""+x);
				if( x <= 1998 && x/2*2 != AVL.rootValue(p.le) )
					throw new Error(""+x);
				if( AVL.right(p.le) != null && AVL.rootValue(AVL.right(p.le)) <= x )
					throw new Error(""+x);
			}
			else
			{
				if( x >= 0 ) throw new Error(""+x);
				if( AVL.find(t,x) || AVL.find(t,x-1) ) throw new Error(""+x);
			}
			if( p.gt != null )
			{
				if( AVL.rootValue(p.gt) <= x )
					throw new Error(""+x);
				if( x < 0 && AVL.rootValue(p.gt) != 0 )
					throw new Error(""+x);
				if( x >= 0 && (x+2)/2*2 != AVL.rootValue(p.gt) )
					throw new Error(""+x);
				if( AVL.left(p.gt) != null && AVL.rootValue(AVL.left(p.gt)) > x )
					throw new Error(""+x);
			}
			else
			{
				if( x < 1998 ) throw new Error(""+x);
				if( AVL.find(t,x+1) || AVL.find(t,x+2) ) throw new Error(""+x);
			}
		}
	}
	
	public static void main( String[] args )
	{
		AVL<Integer> t = null;
		for( int n=0 ; n!=10 ; n++ )
			for( int i=0 ; i!=1000 ; i++ )
				t = AVL.insert(t,2*i);
		final AVL<Integer> s = t;
		final Pair<Integer> p = new Pair<Integer>();
		try
		{
			test_LastLE_FirstGT
							( i ->
								{
									searchRecursive(s,i,p);
									return p;
								}
							, s
							);
		}
		catch( Error e )
		{
			System.out.println("Error in searchRecursive searching for "+e.getMessage());
		}
		try
		{
			test_LastLE_FirstGT
							( i ->
								{
									p.le = p.gt = null;
									searchTailRecursive(s,i,p);
									return p;
								}
							, s
							);
		}
		catch( Error e )
		{
			System.out.println("Error in searchTailRecursive searching for "+e.getMessage());
		}
		try
		{
			test_LastLE_FirstGT
							( i ->
								{
									searchLoop(s,i,p);
									return p;
								}
							, s
							);
		}
		catch( Error e )
		{
			System.out.println("Error in searchLoop searching for "+e.getMessage());
		}
		System.out.println("Testing is done");
	}
}